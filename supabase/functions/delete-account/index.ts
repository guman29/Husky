// Husky: self-service account deletion. Called from Settings.jsx via
// supabase.functions.invoke('delete-account'). Deleting an auth.users row
// requires the service-role key, which must never be shipped to the
// browser -- this function holds that key server-side and only ever acts
// on the identity proven by the caller's own JWT, never an id passed in
// by the client.
//
// Deploy with: npx supabase functions deploy delete-account
// SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY are
// provided automatically by the Supabase platform -- no secrets to set by hand.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// Storage buckets aren't covered by the database's cascade deletes (files
// are referenced by URL, not a real foreign key), so they're cleaned up
// explicitly here. Both buckets use <user_id>/... as the first path
// segment, but listing-photos nests one level deeper
// (<seller_id>/<listing_id>/<file>) than pet-avatars (<owner_id>/<file>),
// so this recurses one level into any folder entries it finds.
async function deleteAllUnderPrefix(adminClient, bucket: string, prefix: string) {
  const { data: entries } = await adminClient.storage.from(bucket).list(prefix, { limit: 1000 })
  if (!entries || entries.length === 0) return

  const filePaths: string[] = []
  for (const entry of entries) {
    if (entry.id === null) {
      // A folder entry -- recurse one level.
      const { data: nested } = await adminClient.storage
        .from(bucket)
        .list(`${prefix}/${entry.name}`, { limit: 1000 })
      for (const nestedEntry of nested || []) {
        filePaths.push(`${prefix}/${entry.name}/${nestedEntry.name}`)
      }
    } else {
      filePaths.push(`${prefix}/${entry.name}`)
    }
  }

  if (filePaths.length > 0) {
    await adminClient.storage.from(bucket).remove(filePaths)
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return jsonResponse({ error: 'Missing Authorization header.' }, 401)
  }

  try {
    // Verify who's actually calling, using their own session -- this is
    // what prevents one user from ever being able to delete another.
    const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })
    const {
      data: { user },
      error: userError,
    } = await callerClient.auth.getUser()

    if (userError || !user) {
      return jsonResponse({ error: "Couldn't verify your session. Please log in again." }, 401)
    }

    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    await deleteAllUnderPrefix(adminClient, 'pet-avatars', user.id)
    await deleteAllUnderPrefix(adminClient, 'listing-photos', user.id)

    // Deleting the auth user cascades through pets (-> vaccines, vet
    // visits, feeding/weight/grooming/activity logs), listings, messages,
    // and reminders automatically, per the foreign keys in schema.sql.
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)
    if (deleteError) {
      return jsonResponse({ error: deleteError.message }, 500)
    }

    return jsonResponse({ success: true })
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : String(error) }, 500)
  }
})
