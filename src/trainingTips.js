// Training content for the Training section (src/pages/Training.jsx). No
// database table needed -- this is the same for every user, so it lives in
// code. Each topic follows a consistent expert-style shape:
//   title      - short name of the technique
//   overview   - what it is and why it matters (1-2 sentences)
//   steps      - ordered, concrete technique steps
//   mistakes   - common mistakes that undermine the technique
//   timeline   - a realistic expectation for how long it takes
//
// trainingTips: general topics shown when no pet (or no species) is selected.
// speciesTips: shown once a pet's species is known.
// breedTips: shown for the handful of common breeds we've hand-written
// content for. Anything not in here (most breeds in petData.js) falls
// through to the AI-generated fallback in Training.jsx instead -- that's
// intentional, not a gap to fill in by hand.

export const trainingTips = [
  {
    id: 'potty-training',
    title: 'Potty training',
    overview:
      "Potty (or litter box) training works by preventing accidents through supervision and routine, then reinforcing the right location heavily until it becomes habit.",
    steps: [
      'Pick one consistent bathroom spot (an outdoor spot, or the litter box location) and take your pet there every time.',
      "Go first thing in the morning, right after meals, right after naps, and right after play -- these are the moments elimination is most likely.",
      "Stay with them instead of just opening the door, so you can reward within about 3 seconds of them finishing.",
      "Supervise indoors between bathroom trips; if you can't watch them, use a crate or a small confined space just big enough to turn around in.",
      'If you catch an accident starting, interrupt calmly (no yelling) and redirect immediately to the right spot.',
    ],
    mistakes: [
      "Punishing after the fact -- pets can't connect a scolding minutes later to what they did; it mostly teaches them to hide from you when they need to go.",
      'Giving free run of the house too soon, before a reliable pattern is established.',
      'Cleaning accidents with a standard household cleaner that leaves scent behind -- use an enzymatic cleaner, or the smell will draw them back to that exact spot.',
    ],
    timeline:
      'Most puppies and kittens show a reliable pattern within 4-6 weeks of consistent supervision. Occasional regressions during growth spurts, moves, or stress are normal, not a failure of training.',
    videoUrl: 'https://www.youtube.com/watch?v=7vOXWCewEYM',
    videoLabel: 'How to Potty Train Your Puppy Easily (Zak George)',
  },
  {
    id: 'socialization',
    title: 'Social exposure',
    overview:
      'Socialization means positive, low-stress exposure to the world during the critical early window, building a foundation of confidence that carries through adulthood.',
    steps: [
      'Start with short, calm exposures -- a few minutes watching traffic from a distance, hearing a vacuum from another room, or meeting one calm, vaccinated adult animal.',
      'Pair every new experience with something your pet already loves (treats, a favorite toy) so the association is positive from the very first exposure.',
      "Let your pet set the pace -- if they're pulling away, freezing, or refusing treats, you're too close; create distance until they relax again.",
      'Rotate through categories deliberately: people (different ages, hats, uniforms), surfaces (grass, tile, metal grates), sounds (recorded thunder, doorbells, traffic), and other animals.',
      'Keep sessions short (5-15 minutes) and end on a calm, successful note rather than pushing until they show stress.',
    ],
    mistakes: [
      '"Flooding" -- forcing prolonged exposure to something scary to "get it over with" almost always backfires and creates a lasting fear instead of curing one.',
      'Only socializing around other animals and skipping objects, sounds, and surfaces, which are just as often the real source of adult fearfulness.',
      'Waiting until vaccines are fully complete to start any exposure at all -- controlled, low-risk exposure (carrying a puppy rather than letting paws touch public ground) can safely start earlier.',
    ],
    timeline:
      "The critical socialization window is short and doesn't fully reopen once it closes, but most of the groundwork happens in the first few months. Continue lighter exposure through the first year to cement confidence into adulthood.",
    videoUrl: 'https://www.youtube.com/watch?v=Ad_UZ0H3eWY',
    videoLabel: 'How to Socialize Your New Puppy (Certified Dog Behavior Consultant)',
  },
  {
    id: 'basic-obedience',
    title: 'Basic obedience cues',
    overview:
      'Reliable obedience is built in four stages -- teach the behavior, then add duration, then distance, then distractions -- introduced one at a time, never all at once.',
    steps: [
      'Lure the behavior first (e.g. a treat over the head to prompt a sit) and mark the instant it happens with a consistent word ("yes") or a clicker.',
      'Once they offer the behavior reliably to the lure, add the verbal cue just before the action, then fade the lure out over several sessions.',
      'Extend duration gradually -- "sit" held for 1 second, then 3, then 10 -- before ever asking for distance or adding distractions.',
      "Practice in a new, quiet location once it's mastered in the first one -- pets don't automatically generalize a skill to a new environment.",
      'Only add distractions (another person, a dropped toy) once the cue is completely solid with none at all.',
    ],
    mistakes: [
      'Repeating the cue word multiple times ("sit, sit, SIT") -- this teaches that the first one or two repetitions don\'t actually count.',
      'Practicing only in one room, then expecting the behavior to hold up at the park on day one.',
      'Moving to distance or distractions before duration is solid, which sets the pet up to fail and erodes confidence in the cue itself.',
    ],
    timeline:
      'A single cue in a low-distraction setting typically takes 1-2 weeks of daily 5-minute sessions. A fully "proofed" version reliable around real-world distractions usually takes 2-3 months.',
    videoUrl: 'https://www.youtube.com/watch?v=dKbWFBIEa9U',
    videoLabel: 'Basic Dog Obedience Training: Sit, Stay, and Down',
  },
  {
    id: 'crate-training',
    title: 'Crate training',
    overview:
      "A crate should become your pet's own den -- somewhere they choose to relax, not a punishment -- built through gradual, positive association rather than forced confinement.",
    steps: [
      'Leave the crate door open and toss treats inside throughout the day, so entering is always their own choice at first.',
      'Feed meals inside the crate with the door open, moving the bowl a little further back with each meal.',
      "Once they're comfortable eating inside, close the door for just a few seconds during a meal, opening it again before any whining starts.",
      'Gradually extend closed-door time, starting with you in the room and building up to briefly leaving the house.',
      'Add a cue word ("kennel" or "crate") paired with a high-value treat they only ever get in the crate, so it stays a special place.',
    ],
    mistakes: [
      'Using the crate as punishment, which can undo weeks of positive association in a single incident.',
      'Letting them out while whining or barking, which teaches that protest behavior is what makes the door open.',
      'Jumping straight to a full night or a full workday of confinement before shorter sessions have gone well.',
    ],
    timeline:
      'Most pets accept short confinement within 1-2 weeks. Full comfort with an 8-hour workday or overnight crate typically takes 3-4 weeks of gradual buildup.',
    videoUrl: 'https://www.youtube.com/watch?v=han1DXBfN5c',
    videoLabel: 'Crate Training Made Easy for Your Puppy',
  },
  {
    id: 'leash-walking',
    title: 'Leash walking',
    overview:
      'Loose-leash walking is taught by making a tight leash consistently unproductive and a loose leash consistently the only way to keep moving toward what they want.',
    steps: [
      'Start in a low-distraction area (your yard or a hallway) before attempting a real walk outside.',
      "The instant the leash goes tight, stop walking completely and wait -- don't pull back or say anything.",
      'The moment the leash slackens (they turn back toward you or the tension eases), immediately continue walking as the reward.',
      'Reward position near you generously and often at first -- a treat delivered right at your leg reinforces exactly where you want them to be.',
      'Gradually increase distraction level and distance once the pattern is solid in an easy environment.',
    ],
    mistakes: [
      'Continuing to walk while the leash is tight -- this is the single most common mistake, and it directly teaches that pulling gets them there faster.',
      'Only ever practicing on real walks, where genuine distractions make early learning much harder than it needs to be.',
      'Using a leash that\'s too long for early training, which delays the tight/loose feedback loop your pet needs to learn from.',
    ],
    timeline:
      'Expect a noticeable improvement within 1-2 weeks of consistent stop-and-wait practice. A truly loose leash around high distractions (other dogs, squirrels) can take a few months.',
    videoUrl: 'https://www.youtube.com/watch?v=C5g0ph4lC1Y',
    videoLabel: 'Loose Leash Walking Made Easy (Nate Schoemer)',
  },
  {
    id: 'handling-grooming',
    title: 'Handling & grooming tolerance',
    overview:
      'Grooming and vet-visit tolerance comes from separating "being touched" from "something happening to me." Pets comfortable with handling long before their first real grooming session are dramatically less stressed by it.',
    steps: [
      'Touch one area at a time (a paw, an ear) for about a second, then treat -- keep initial sessions almost absurdly short and easy.',
      "Gradually increase duration and add mild pressure (a gentle paw squeeze mimicking a nail trim) once they're relaxed with simple touch.",
      'Introduce tools (brush, clippers, toothbrush) at a distance first -- let them sniff it and earn treats just for being near it, with no actual use yet.',
      'Turn clippers or trimmers on near (not on) them and reward calm behavior before ever making contact with the running tool.',
      'Do one nail, one brush stroke, or ten seconds of brushing per session at first, and stop before any stress signs show up.',
    ],
    mistakes: [
      'Attempting a full grooming session (all nails, a full brush-out) before individual-body-part tolerance has been built.',
      "Restraining a struggling pet to \"just get it done\" -- this is the fastest way to create a lasting negative association with grooming.",
      'Skipping the tool-desensitization step entirely and just starting to use clippers or brushes cold.',
    ],
    timeline:
      'Basic handling tolerance for paws, ears, and mouth typically builds within 2-3 weeks. Full comfort with actual grooming tools takes 4-6 weeks of regular short sessions.',
    videoUrl: 'https://www.youtube.com/watch?v=_XQQQDDttrY',
    videoLabel: 'Desensitization Training: Build Trust & Prepare for Vet Care & Grooming',
  },
]

export const speciesTips = {
  Dog: [
    {
      id: 'dog-recall',
      title: 'Reliable recall ("come")',
      overview:
        'A dog that comes when called reliably is one of the most safety-critical behaviors you can teach, and it\'s built entirely through the word meaning something wonderful, never something bad.',
      steps: [
        'Start indoors with zero distractions: say "come" once in an upbeat tone from a few feet away, then reward heavily the instant they arrive.',
        'Add mild distance and mild distractions gradually -- a different room, then the yard, then a quiet park.',
        'Use a long training leash (15-30 ft) outdoors so you can prevent failures rather than repeat the cue if they ignore it.',
        'Practice "recall races" -- call, reward, release them to go sniff again, and call again, so coming to you doesn\'t end the fun.',
        'Randomize rewards once the behavior is solid: sometimes a treat, sometimes a favorite toy, sometimes just enthusiastic praise and release.',
      ],
      mistakes: [
        'Ever calling them to you for something unpleasant (a bath, nail trim, being put away) -- go get them instead, so "come" always predicts good things.',
        'Repeating the cue over and over when they don\'t respond, which teaches that the first several calls are optional.',
        'Punishing them after a slow or reluctant recall -- even if it took a while, punishing the arrival teaches them arriving was the mistake.',
      ],
      timeline:
        'A solid indoor recall usually takes 1-2 weeks. Reliable off-leash recall around real distractions is a months-long project and, for high-prey-drive breeds, may never be fully off-leash-safe near traffic.',
    },
    {
      id: 'dog-jumping',
      title: 'Curbing jumping on people',
      overview:
        "Jumping is almost always an attention-seeking or greeting behavior, so the fix is to remove the reward it currently gets (attention) and reward the alternative you want instead.",
      steps: [
        'The instant paws leave the ground, turn away, fold your arms, and stay silent -- no eye contact, no pushing them off (which is still attention).',
        'The moment all four paws are on the ground, immediately give calm praise and a treat.',
        'Practice greetings deliberately: have a calm helper approach, and reward your dog only for staying seated or standing.',
        'Teach an incompatible behavior like "sit for greeting" so there\'s a clear job to do instead of jumping.',
        'Brief every guest before they enter: ignore jumping, reward four-on-the-floor.',
      ],
      mistakes: [
        'Inconsistency across the household -- if jumping gets attention from one person even occasionally, the behavior persists.',
        'Yelling or pushing the dog away, both of which register as attention/play to an excited dog and can reinforce the behavior.',
        'Only addressing it during calm practice sessions and not with actual excited greetings, which is when it matters most.',
      ],
      timeline:
        'Noticeable improvement within 1-2 weeks of consistent non-reinforcement. Full reliability around genuinely exciting arrivals (owner coming home, guests) can take 4-8 weeks.',
    },
    {
      id: 'dog-chewing',
      title: 'Redirecting destructive chewing',
      overview:
        "Chewing is a normal, necessary behavior (especially for teething puppies) -- the goal isn't to stop it, it's to redirect it entirely onto appropriate items.",
      steps: [
        "Puppy-proof the environment: keep shoes, cords, and valuables out of reach rather than relying on willpower alone.",
        'Keep 2-3 appropriate chew toys within reach at all times so you can swap an inappropriate item for a good one immediately.',
        'When you catch them chewing something wrong, calmly remove it and hand them an approved chew, then praise once they engage with it.',
        'Rotate chew toy variety (textures, flavors) weekly to keep them interesting rather than ignored.',
        'For teething puppies specifically, offer a frozen wet washcloth or a chilled chew toy to soothe sore gums.',
      ],
      mistakes: [
        'Only praising when you catch them chewing the right thing, and never redirecting in the moment they chew the wrong thing.',
        'Giving old shoes or socks as chew toys -- this teaches that shoes in general are fair game, including your current ones.',
        'Assuming chewing is "bad behavior" rather than checking for boredom or under-exercise, which is often the real driver in adult dogs.',
      ],
      timeline:
        'Puppy teething-driven chewing naturally decreases by 6-7 months as adult teeth finish coming in. Destructive chewing from boredom in adult dogs typically resolves within 2-4 weeks once exercise and appropriate outlets increase.',
    },
  ],
  Cat: [
    {
      id: 'cat-litter',
      title: 'Litter box success',
      overview:
        "Litter box problems are almost always solvable by fixing the setup (box count, location, cleanliness, substrate) before assuming it's a behavioral issue.",
      steps: [
        'Follow the "one box per cat, plus one" rule, placed in separate quiet, low-traffic locations, not clustered together.',
        'Scoop at least once daily -- cats are significantly more likely to avoid a box that already smells used.',
        'Use unscented, fine-grained clumping litter as a default; cats generally prefer it, and scented litter can be a deterrent.',
        'Keep boxes away from food/water bowls and away from loud appliances (washing machines, furnaces) that could startle them mid-use.',
        'If a preference issue appears, offer 2-3 boxes with different litter types side by side to identify what they actually prefer.',
      ],
      mistakes: [
        'Assuming a litter box issue is "spite" or misbehavior -- it\'s almost always communicating a real problem with the box, the litter, or health.',
        'Switching litter brands suddenly without a gradual transition, which can cause avoidance on its own.',
        'Not ruling out a UTI or other medical cause first when a previously reliable cat suddenly stops using the box -- this needs a vet visit, not just retraining.',
      ],
      timeline:
        'Simple setup fixes (adding boxes, cleaning more often) often show improvement within days. A genuine substrate or location preference issue can take 1-2 weeks of side-by-side testing to resolve.',
    },
    {
      id: 'cat-scratching',
      title: 'Scratching post training',
      overview:
        "Cats scratch to mark territory and maintain their claws -- it can't be eliminated, only redirected onto a post that's more appealing than your furniture.",
      steps: [
        "Place a sturdy, tall post (able to withstand a full-body stretch) right next to the furniture they're currently scratching.",
        'Choose a rough, vertical material (sisal rope is a strong default) since most cats prefer it over carpet-covered posts.',
        'Rub a little catnip or silvervine into the post, or dangle a toy near it, to draw initial interest.',
        'Reward any use of the post immediately with praise or a treat, even just a single scratch.',
        'Once they\'re using the new post reliably, gradually move it a few inches at a time toward its permanent location if needed.',
      ],
      mistakes: [
        'Buying a short, wobbly, or carpet-covered post -- instability or the wrong texture is the most common reason cats ignore a new post.',
        "Punishing scratching on furniture, which just teaches the cat to avoid scratching in front of you rather than to stop.",
        'Placing the post somewhere out of the way instead of near the furniture already being used -- location matters more than most owners expect.',
      ],
      timeline:
        'Most cats redirect to an appropriately placed, appropriately textured post within 1-2 weeks. Regular nail trims (every 2-3 weeks) alongside this reduces furniture damage even faster.',
    },
    {
      id: 'cat-carrier',
      title: 'Carrier comfort',
      overview:
        "Carrier stress comes from the carrier only ever appearing right before something unpleasant. Making it a permanent, neutral piece of furniture breaks that association.",
      steps: [
        "Leave the carrier out year-round in a room your cat spends time in, door open, rather than storing it away between vet trips.",
        'Toss treats or a meal inside occasionally so entering is their own choice, with no pressure to stay.',
        'Add a soft blanket or an item with your scent on it to make the inside more inviting.',
        'Practice brief door-closing sessions (a few seconds, then open) while giving treats through the door.',
        'Practice short car rides to nowhere in particular (around the block) so car + carrier isn\'t exclusively linked to the vet.',
      ],
      mistakes: [
        'Only bringing the carrier out immediately before a vet trip, which turns its mere appearance into a stress trigger.',
        'Chasing and stuffing a resistant cat into the carrier at the last minute, which reinforces exactly the fear you\'re trying to reduce.',
        'Using the carrier only for stressful trips (vet) and never for anything neutral or positive.',
      ],
      timeline:
        'Basic comfort with an always-available carrier typically develops within 2-3 weeks. Calm tolerance of actual travel takes longer and benefits from occasional low-stakes practice trips.',
    },
  ],
  Bird: [
    {
      id: 'bird-step-up',
      title: '"Step up" training',
      overview:
        '"Step up" is the foundation cue for handling a bird safely and confidently, built through short, low-pressure repetitions rather than forcing physical contact.',
      steps: [
        'Start with the bird in its cage or a neutral space, offering a finger or perch just above (not pushing into) its feet.',
        'Say "step up" once, and reward any forward weight shift at first -- you don\'t need a full step to start rewarding.',
        'Gradually raise your criteria to a full step onto the finger/perch before treating.',
        'Practice several very short (1-2 minute) sessions per day rather than one long session, which birds tire of quickly.',
        'Once reliable on a finger, practice the same cue with a training perch so the bird generalizes the behavior beyond just your hand.',
      ],
      mistakes: [
        "Pushing your finger into the bird's chest/feet to force the step, which reads as a threat rather than an invitation.",
        'Only practicing when you need to move the bird somewhere, rather than in neutral, low-stakes daily sessions.',
        'Giving up after a bite or refusal instead of backing off criteria to the last successful step and rebuilding from there.',
      ],
      timeline:
        'Hand-raised, tame birds often learn step-up within days. Nervous or previously mishandled birds can take several weeks of daily short sessions to build enough trust.',
    },
    {
      id: 'bird-cage',
      title: 'Cage comfort & daily routine',
      overview:
        'Birds are highly routine-driven, and a predictable daily schedule reduces stress-related behaviors like feather plucking and excessive screaming far more effectively than any single training technique.',
      steps: [
        'Keep the cage in a room with normal household activity (not an isolated back room) so your bird stays socially engaged.',
        'Set a consistent daily schedule: uncover/cover times, feeding times, and dedicated out-of-cage time at the same hours each day.',
        'Provide a consistent 10-12 hours of uninterrupted dark, quiet sleep time -- irregular light exposure is a common cause of behavioral issues.',
        'Rotate 2-3 toys in and out weekly rather than leaving the same ones up permanently, which prevents boredom without overwhelming the cage.',
        'Schedule daily out-of-cage time at a consistent hour so your bird learns to anticipate and wait calmly for it.',
      ],
      mistakes: [
        'Irregular sleep schedules (leaving a TV or light on near the cage into the night), which is one of the most common drivers of screaming and aggression.',
        'Placing the cage in an isolated room to reduce noise -- this often increases attention-seeking behavior instead.',
        'Changing cage layout or location frequently, which undermines the sense of security a stable environment provides.',
      ],
      timeline:
        'Behavioral improvements from a consistent routine are often noticeable within 1-2 weeks, though deeply ingrained stress behaviors like established feather plucking may need a vet or avian behaviorist alongside routine changes.',
    },
  ],
  Rabbit: [
    {
      id: 'rabbit-litter',
      title: 'Litter training',
      overview:
        "Rabbits naturally pick one or two corners as their bathroom spot -- litter training works with that instinct rather than against it.",
      steps: [
        'Observe which corner(s) your rabbit already gravitates toward for droppings and place a litter box there rather than somewhere convenient for you.',
        'Use rabbit-safe litter (paper-based or wood-pellet, never clumping clay or cat litter) with a layer of hay on top.',
        'Confine your rabbit to a smaller space initially (an exercise pen) with the box clearly accessible, expanding their range as habits solidify.',
        'Leave a few droppings in the box when first set up to help mark it as the right spot.',
        'Clean the box daily but avoid full bleach-scrubbing, which removes the scent that reinforces the habit.',
      ],
      mistakes: [
        'Using clumping or scented litter, which is genuinely dangerous if ingested and should never be used for rabbits.',
        "Placing the box somewhere the rabbit doesn't already prefer, then expecting them to change their instinctive corner choice.",
        'Giving full free-roam access before litter habits are established, which makes accidents much harder to prevent and correct.',
      ],
      timeline:
        'Most rabbits show a reliable pattern within 1-2 weeks once spaying/neutering is done (which significantly improves litter reliability) and the box is in the right spot.',
    },
    {
      id: 'rabbit-handling',
      title: 'Handling & lifting',
      overview:
        "Rabbits have a fragile spine and powerful hind legs -- improper lifting is a leading cause of serious injury, so correct technique matters more here than for most pets.",
      steps: [
        'Approach at floor level rather than reaching down from above, which can startle a prey-instinct animal.',
        'Place one hand under the chest/front legs and the other fully supporting the hindquarters and back legs -- never lift by the front alone.',
        'Hold the rabbit close against your body, not out and away, so a sudden kick has nowhere to go.',
        'Keep initial handling sessions brief (30-60 seconds), gradually extending as your rabbit relaxes rather than stays tense.',
        "Let your rabbit approach you for treats on the ground first, building trust before regular lifting becomes necessary.",
      ],
      mistakes: [
        'Lifting by the ears or scruff alone -- both are painful and can cause real injury.',
        'Letting the hindquarters dangle unsupported, which risks a spinal injury if the rabbit kicks and twists.',
        'Forcing handling sessions with a stressed, struggling rabbit rather than setting them down and trying again later.',
      ],
      timeline:
        'Comfort with brief, correct handling often develops within 2-3 weeks of short, positive sessions. Some rabbits remain more tolerant of being near you than of being picked up, which is a normal individual preference to respect.',
    },
  ],
  Fish: [
    {
      id: 'fish-feeding',
      title: 'Feeding routine & tank health',
      overview:
        "Fish \"training\" is really tank management -- a consistent feeding routine and stable water conditions prevent the vast majority of health problems before they start.",
      steps: [
        'Feed a consistent small amount once or twice daily -- only what can be fully consumed within about 2 minutes.',
        'Remove any uneaten food after a few minutes rather than letting it decompose and foul the water.',
        'Test water parameters (ammonia, nitrite, nitrate, pH) weekly with a liquid test kit, not just visual inspection.',
        'Perform a partial water change (10-25%) weekly rather than waiting for visible cloudiness or a problem.',
        'Keep feeding at consistent times each day -- fish anticipate schedules, and consistency makes appetite changes an early, reliable warning sign.',
      ],
      mistakes: [
        'Overfeeding -- this is the single most common cause of poor water quality and preventable fish illness.',
        'Feeding based on how "hungry" fish appear at the glass, which is often just a learned response to your presence, not actual hunger.',
        'Changing 100% of the water at once, which crashes the beneficial bacteria colony the tank depends on for stability.',
      ],
      timeline:
        'A new tank needs 4-6 weeks to fully cycle (establish stable beneficial bacteria) before it can safely support a normal feeding routine and full fish population.',
    },
  ],
  Reptile: [
    {
      id: 'reptile-handling',
      title: 'Handling desensitization',
      overview:
        "Reptiles don't seek social interaction the way mammals do, so handling tolerance is built through calm predictability rather than bonding activities.",
      steps: [
        'Let a newly acquired reptile settle into its enclosure undisturbed for 1-2 weeks before any handling attempts.',
        'Start with very brief sessions (a minute or less), letting the reptile move onto your hand rather than grabbing it.',
        'Support the full body weight evenly rather than gripping -- reptiles feel more secure when they don\'t feel like they might fall.',
        'Handle at a consistent, calm time of day, and always after a meal has been fully digested (24-48 hours, species-dependent), not right after feeding.',
        'Gradually extend session length only as long as body language stays relaxed (no hissing, puffing, tail-whipping, or repeated escape attempts).',
      ],
      mistakes: [
        'Handling right after feeding, which risks stress-induced regurgitation, especially in snakes.',
        'Restraining a reptile that\'s actively trying to escape, which increases stress and can damage the trust you\'re trying to build.',
        'Handling daily for long periods early on -- most reptiles do better with brief, infrequent sessions at first.',
      ],
      timeline:
        'Basic tolerance for brief handling often develops within 3-4 weeks for captive-bred individuals; wild-caught or previously stressed reptiles can take several months, and some species (many snakes) never seek handling the way lizards or tortoises might.',
    },
    {
      id: 'reptile-basking',
      title: 'Basking & temperature routine',
      overview:
        "Reptiles regulate nearly all behavior (including activity level and willingness to interact) around their ability to thermoregulate, so a consistent temperature gradient matters more than any single training technique.",
      steps: [
        "Set up a clear thermal gradient: a warm basking spot on one end of the enclosure, a cooler zone on the other.",
        'Check both the basking surface temperature and the cool-zone ambient temperature daily with a digital probe thermometer, not just the built-in dial on the heat lamp.',
        'Run lighting (including UVB, for species that need it) on a consistent daily schedule matching natural day length for that species.',
        'Replace UVB bulbs on the manufacturer\'s recommended schedule (often every 6-12 months) even if the bulb still visibly lights up -- UVB output degrades before visible light does.',
        'Use the daily temperature check as a built-in health check-in: a reptile avoiding its basking spot, or basking excessively, is often signaling a problem.',
      ],
      mistakes: [
        'Relying on the thermostat dial or the heat lamp\'s presence alone instead of actually measuring temperatures with a separate thermometer.',
        'Skipping UVB replacement because the bulb still emits visible light -- this silently leads to metabolic bone disease over time in UVB-dependent species.',
        'Handling or otherwise disrupting a reptile while it\'s actively basking, which interrupts a genuine physiological need, not just a preference.',
      ],
      timeline:
        "Temperature and lighting routines should be stable from day one, not something to \"train\" gradually. Health effects of an incorrect setup can take weeks to months to become visible, which is why daily verification matters more than it might seem.",
    },
  ],
  Other: [],
}

export const breedTips = {
  'Labrador Retriever': [
    {
      id: 'lab-energy',
      title: 'Channel their retrieving drive',
      overview:
        "Labs were purpose-bred to retrieve for hours, so structured retrieving games aren't just play -- they're a genuine outlet that prevents that drive from turning into destructive behavior.",
      steps: [
        'Build a daily fetch or retrieving-game session into the routine, not just occasional play.',
        'Teach a formal "hold" and "give/drop" using a soft toy, which channels their natural carrying instinct productively.',
        'Introduce water retrieving (if safe and available) early, since most Labs take to it naturally and it\'s excellent low-impact exercise.',
        'Use food puzzle toys on lower-activity days to keep the retrieving/foraging drive engaged without extra physical exertion.',
      ],
      mistakes: [
        "Relying on leash walks alone for exercise -- Labs typically need more vigorous, drive-satisfying activity than a walk provides.",
        'Playing fetch obsessively without ever teaching "enough" -- some Labs will fetch to the point of exhaustion or injury without an off switch being taught.',
      ],
      timeline:
        'A daily retrieving outlet noticeably reduces destructive chewing and hyperactivity within 1-2 weeks for most Labs.',
    },
    {
      id: 'lab-food',
      title: 'Manage food motivation',
      overview:
        "Labs are famously food-driven, which makes them very easy to train but also prone to weight gain, counter-surfing, and resource guarding if food access isn't managed deliberately.",
      steps: [
        'Use their high food motivation to your advantage in training -- small, low-calorie treats (kibble pieces work well) make Labs exceptionally fast learners.',
        'Measure meals rather than free-feeding, and account for training treats within their daily calorie total.',
        'Keep counters and trash clear, and practice a "leave it" cue specifically around food from an early age.',
        'Use puzzle feeders or slow-feed bowls to extend mealtime and add mental engagement to a meal they\'d otherwise inhale in seconds.',
      ],
      mistakes: [
        "Underestimating portion sizes because a Lab \"seems hungry\" -- they're notorious for acting hungry regardless of how recently they ate.",
        'Free-feeding (leaving food out all day), which removes a useful training tool and makes weight gain much harder to track.',
      ],
      timeline:
        'Weight and begging behavior respond within 3-4 weeks of a measured feeding routine; this is an ongoing management practice rather than a one-time fix.',
    },
  ],
  'Golden Retriever': [
    {
      id: 'golden-mouthiness',
      title: 'Redirect natural mouthiness',
      overview:
        "Goldens carry things in their mouths as a breed trait, not usually a sign of aggression -- the goal is to give that instinct an appropriate, permanent outlet.",
      steps: [
        'Keep a "job" item -- a soft toy or a specific stuffed animal -- available for them to carry around the house.',
        'Redirect any mouthing on hands or clothing immediately to the job item rather than just saying "no."',
        'Teach a solid "drop it" cue using a trade-up method (offering something better in exchange), which also helps with any future resource guarding.',
        'Reward calm mouth-off greetings deliberately, since an excited Golden will often default to grabbing something to carry when greeting people.',
      ],
      mistakes: [
        'Punishing mouthing outright without redirecting to an acceptable alternative, which leaves the underlying instinct with nowhere to go.',
        'Playing tug-of-war roughly with hands/clothing rather than a designated toy, which blurs the line you\'re trying to teach.',
      ],
      timeline: 'Consistent redirection typically shows clear improvement within 2-3 weeks.',
    },
    {
      id: 'golden-social',
      title: 'Structured socialization for high social drive',
      overview:
        "Goldens' strong eagerness to please makes obedience training unusually smooth, but their equally strong social drive means they can get overexcited around people and other dogs without deliberate practice.",
      steps: [
        'Practice calm greetings specifically -- reward for four-on-the-floor and a relaxed body before allowing full interaction with a new person or dog.',
        "Use their eagerness to please to your advantage: keep training sessions upbeat and reward-rich, since Goldens respond very well to praise alongside treats.",
        'Practice "settle" on a mat during moderately exciting situations (visitors arriving, family activity) to build an off switch.',
        'Give structured social outlets (dog park visits, playdates) rather than relying only on incidental encounters to satisfy their social needs.',
      ],
      mistakes: [
        'Assuming a naturally friendly temperament means socialization and impulse control training aren\'t necessary -- high social drive without training often shows up as overexcitement, not calm confidence.',
        'Only correcting overexcitement in the moment without practicing calm greetings deliberately when it\'s easy to succeed.',
      ],
      timeline: 'A reliable "settle around excitement" cue generally takes 3-4 weeks of regular practice.',
    },
  ],
  'German Shepherd': [
    {
      id: 'gsd-mental',
      title: 'Prioritize mental stimulation',
      overview:
        'German Shepherds are working dogs bred for complex jobs, and insufficient mental stimulation -- even with plenty of physical exercise -- commonly shows up as pacing, excessive barking, or destructive behavior.',
      steps: [
        'Incorporate scent work (nose games, hiding treats around a room) a few times a week -- this taps directly into working-breed instincts and is mentally tiring in a way physical exercise alone isn\'t.',
        'Rotate through obedience, trick training, and puzzle feeders rather than repeating the same routine daily.',
        'Give them a "job" if possible -- carrying a pack on walks, formal obedience or agility classes, or structured guard/alert training with a professional.',
        'Balance high-energy exercise with calm-focus activities (structured settle/place training) so mental stimulation isn\'t only ever exciting.',
      ],
      mistakes: [
        "Assuming a long physical walk alone is sufficient -- GSDs often need the mental component just as much as the physical one.",
        'Under-stimulating and then addressing the resulting behaviors (barking, destruction) as if they were purely obedience problems rather than an unmet need.',
      ],
      timeline: 'Boredom-driven behaviors typically improve within 2-3 weeks of adding structured mental work.',
    },
    {
      id: 'gsd-confidence',
      title: 'Build confident socialization',
      overview:
        'German Shepherds are often naturally reserved or watchful with strangers by breed temperament -- this is normal, not a flaw, and early, deliberate socialization shapes whether it becomes confident wariness or fearfulness.',
      steps: [
        'Expose puppies to a wide range of people, places, and situations early, always letting them observe and approach at their own pace.',
        'Reward calm curiosity around new people rather than forcing greetings or interactions.',
        "Avoid overly formal \"protection\" framing early on -- a well-socialized GSD's natural watchfulness is sufficient without deliberately encouraging suspicion of strangers.",
        'Continue structured exposure through adolescence (6-18 months), a period where previously confident dogs can develop new sensitivities.',
      ],
      mistakes: [
        'Encouraging or rewarding wariness/barking at strangers as "protective," which can escalate a normal trait into a genuine behavior problem.',
        "Stopping socialization efforts after puppyhood -- the adolescent fear period is a common point where earlier confidence regresses without continued exposure.",
      ],
      timeline: 'Early socialization work shows benefits within weeks, but should continue through at least 18 months of age.',
    },
  ],
  Poodle: [
    {
      id: 'poodle-intelligence',
      title: 'Keep training sessions varied',
      overview:
        'Poodles are among the most intelligent dog breeds and get bored with repetition quickly -- variety keeps their engagement (and cooperation) high.',
      steps: [
        'Rotate between 2-3 different skills within a single training session rather than drilling one cue repeatedly.',
        'Introduce trick training early (spin, wave, play dead) -- Poodles typically pick up new tricks fast and enjoy the novelty.',
        'Use puzzle toys and scent games on non-training days to keep their mind engaged between formal sessions.',
        'Advance quickly once a skill is learned -- Poodles can get disengaged if held at an already-mastered level too long.',
      ],
      mistakes: [
        'Repeating the same drill for a full session, which a bored Poodle may start "improvising" on or disengaging from entirely.',
        'Underestimating how much mental stimulation they need relative to their size -- boredom in Poodles often shows up as excessive barking or attention-seeking.',
      ],
      timeline: 'Most Poodles learn a new basic cue within just a few days of varied, engaging practice.',
    },
    {
      id: 'poodle-grooming',
      title: 'Early grooming desensitization',
      overview:
        "Poodles require frequent, involved grooming for their coat, so building tolerance for brushing, clippers, and standing still on a table needs to start as early as possible.",
      steps: [
        'Introduce a grooming table (or a stable elevated surface) early, rewarding calm standing before any actual grooming happens.',
        'Brush in very short sessions daily rather than a long session weekly, to prevent both matting and grooming-aversion.',
        'Desensitize to clipper noise and vibration at a distance first, exactly as with any other tool desensitization.',
        'Schedule professional grooming visits regularly (every 4-6 weeks) even while coat length is short, so the experience stays familiar rather than novel and stressful.',
      ],
      mistakes: [
        'Waiting until matting or overgrowth forces an urgent, uncomfortable grooming session -- this is one of the fastest ways to create lasting grooming aversion.',
        "Skipping regular professional visits between \"real\" grooms, which makes each visit a bigger, more stressful event than it needs to be.",
      ],
      timeline: 'Comfortable table and brushing tolerance typically builds within 3-4 weeks of daily short sessions started in puppyhood.',
    },
  ],
  'Border Collie': [
    {
      id: 'collie-herding',
      title: 'Redirect herding instinct',
      overview:
        'Border Collies may try to herd kids, joggers, cars, or other pets by nipping, circling, or staring -- this is an instinct, not disobedience, and needs a legitimate outlet rather than suppression alone.',
      steps: [
        'Teach an alternative, incompatible job -- structured fetch, frisbee, or agility -- that satisfies the same chase/control instinct in an appropriate context.',
        'Interrupt herding behavior calmly with a redirect cue ("this way") toward the appropriate outlet activity rather than a punishment.',
        'If formal herding instruction is available in your area, consider it -- it channels the instinct directly rather than fighting it.',
        'Manage triggering situations proactively (leash near joggers/cyclists) while the alternative behavior is still being built.',
      ],
      mistakes: [
        'Trying to eliminate herding behavior entirely through correction alone, without providing any outlet -- this often just suppresses it temporarily or shifts it elsewhere.',
        'Allowing herding of children to continue as "cute" -- it can escalate to nipping and needs consistent redirection from the start.',
      ],
      timeline: 'A consistent redirect outlet typically reduces problem herding within 2-4 weeks.',
    },
    {
      id: 'collie-exercise',
      title: 'Meet their exercise needs before training',
      overview:
        "Border Collies need substantial daily physical and mental exercise before training sessions will really stick -- an under-exercised Border Collie is dramatically harder to get focus from.",
      steps: [
        'Provide at least 1-2 hours of vigorous physical activity daily (fetch, running, agility) before expecting focused training work.',
        'Add structured mental work (obedience sequences, scent games, puzzle toys) as a second, separate category of "exercise," not a substitute for physical activity.',
        'Schedule training sessions after some physical exercise has taken the initial edge off excess energy, when focus is naturally higher.',
        'Introduce dog sports (agility, flyball, herding trials) if possible -- they\'re close to ideal for this breed\'s combined physical and mental needs.',
      ],
      mistakes: [
        'Expecting a short leash walk to be sufficient exercise for this breed -- most Border Collies need considerably more.',
        'Attempting focused training with a physically pent-up dog, then concluding the dog "won\'t listen" rather than addressing the underlying energy level first.',
      ],
      timeline: 'Training focus and cooperation typically improve within days once exercise needs are consistently met.',
    },
  ],
  'Siberian Husky': [
    {
      id: 'husky-recall',
      title: 'Train recall for secured areas only',
      overview:
        'Huskies have a strong prey drive and independent, escape-artist reputation for good reason -- off-leash recall is genuinely unreliable for this breed even with extensive training, so management matters as much as training here.',
      steps: [
        'Practice recall exclusively in securely fenced areas (6-foot fence minimum, buried at the base -- Huskies are skilled diggers and jumpers).',
        'Use high-value rewards and short, frequent recall practice sessions within the secured area to build the strongest possible recall you can.',
        'Rely on a secure harness (not just a collar, which they can back out of) and a sturdy leash everywhere outside a fully secured space.',
        'Provide a legitimate outlet for their drive to run -- structured activities like skijoring, bikejoring, or a properly fitted running harness for controlled runs.',
      ],
      mistakes: [
        'Trusting a "trained" recall enough to go off-leash in an unsecured area -- even well-trained Huskies have a well-documented tendency to run and not return when prey drive kicks in.',
        'Using a standard collar as the primary restraint -- many Huskies can slip a collar; a well-fitted harness is safer.',
      ],
      timeline:
        "This is an ongoing management practice, not something that resolves after a training period -- treat secure-area-only recall as permanent, not a temporary training stage.",
    },
    {
      id: 'husky-digging',
      title: 'Give an outlet for digging',
      overview:
        'Digging is instinctual for Huskies (historically for den-building and temperature regulation), so redirecting it to an acceptable spot works far better than trying to eliminate it.',
      steps: [
        'Designate a specific digging area (a sandbox or a loose-soil garden bed) and bury toys or treats there to draw initial interest.',
        'Redirect digging attempts elsewhere calmly and immediately to the designated spot.',
        'Reward any digging that happens in the approved area enthusiastically.',
        'Check whether digging spikes with heat -- Huskies often dig to reach cooler soil, so ensure adequate shade and cool resting spots are available too.',
      ],
      mistakes: [
        'Punishing digging without providing any approved outlet, which often just shifts the location rather than stopping the behavior.',
        'Overlooking heat as a driver -- if digging is worse in summer, the fix may be more about temperature management than training.',
      ],
      timeline: 'Redirection to a designated spot typically shows results within 1-2 weeks.',
    },
  ],
  'Domestic Shorthair': [
    {
      id: 'dsh-play',
      title: 'Use play to prevent boredom behaviors',
      overview:
        "Domestic shorthairs are adaptable, but daily interactive play is still essential -- without it, boredom commonly shows up as scratching furniture, nighttime zoomies, or overeating.",
      steps: [
        'Schedule two short (10-15 minute) interactive play sessions daily using a wand toy that mimics prey movement.',
        'End each play session by letting them "catch" the toy a few times, followed by a small meal or treat -- this completes the natural hunt-catch-eat-groom-sleep cycle.',
        'Rotate toys weekly to maintain novelty, since cats habituate to the same toy fairly quickly.',
        'Schedule the last play session of the evening a couple hours before your bedtime, which helps reduce nighttime activity.',
      ],
      mistakes: [
        'Only offering toys for independent play and skipping interactive sessions -- most cats need the human-led "hunt" component to be genuinely satisfying.',
        'Playing at inconsistent times, which makes it harder to shift nighttime zoomies to a more convenient part of the day.',
      ],
      timeline: 'Consistent daily play typically reduces problem nighttime activity and scratching within 1-2 weeks.',
    },
  ],
  Siamese: [
    {
      id: 'siamese-vocal',
      title: 'Work with their vocal nature',
      overview:
        'Siamese cats are unusually vocal and social -- meowing is very often a genuine bid for interaction, not just a request for food, and needs to be met rather than ignored outright.',
      steps: [
        'Schedule regular, predictable one-on-one attention time so vocalizing isn\'t the only way to get interaction.',
        'Respond to calm, quiet vocalizing with attention, while withholding attention specifically during excessive or demanding yowling.',
        'Provide consistent interactive play (see general cat play guidance) since under-stimulation often amplifies vocal demands.',
        'Rule out a medical cause if vocalizing suddenly increases -- Siamese are vocal by nature, but a sudden change is still worth a vet check.',
      ],
      mistakes: [
        'Reinforcing excessive yowling by giving in to it specifically (feeding, attention) every time it escalates, which teaches that louder gets faster results.',
        'Assuming all vocalizing is "just the breed" and never investigating whether it\'s signaling boredom, hunger, or a health issue.',
      ],
      timeline: 'A predictable attention schedule typically reduces demand-vocalizing within 2-3 weeks.',
    },
    {
      id: 'siamese-bonding',
      title: 'Lean into their people-oriented streak',
      overview:
        "Siamese cats bond closely with their household and are motivated by genuine interaction, not just food -- this makes them unusually responsive to clicker and trick training compared to many cats.",
      steps: [
        'Introduce clicker training early -- mark the instant of a correct behavior with a click, then treat, which Siamese typically pick up quickly.',
        'Teach simple tricks (sit, high-five, come when called) using short, frequent sessions; their sociability makes this genuinely enjoyable for them.',
        'Use praise and physical affection as rewards alongside treats, since Siamese are often as motivated by attention as by food.',
        'Include your Siamese in daily routines where possible (they often want to be wherever you are) rather than expecting them to entertain themselves for long stretches.',
      ],
      mistakes: [
        "Treating them like a typically independent cat and leaving them alone for long stretches -- Siamese generally tolerate solitude less well than many breeds.",
        'Using only food rewards and ignoring how motivating direct attention is for this breed.',
      ],
      timeline: 'Basic trick training often shows results within 1-2 weeks given their high responsiveness.',
    },
  ],
  'Maine Coon': [
    {
      id: 'mainecoon-water',
      title: 'Expect (and manage) curiosity about water',
      overview:
        "Maine Coons are famously drawn to water, a trait linked to their semi-water-resistant coat -- this needs management (not suppression) to prevent messes and safety issues.",
      steps: [
        'Supervise access to sinks, toilets, and bathtubs, and keep toilet lids closed as a simple safety default.',
        'Provide a cat water fountain, which satisfies the attraction to moving water in a safe, contained way.',
        'If your cat plays in their water bowl, switch to a heavier, wider, spill-resistant bowl to reduce mess.',
        'Consider supervised, shallow water play (a few inches in a basin) as an enrichment activity if your individual cat enjoys it.',
      ],
      mistakes: [
        'Trying to fully stop water-related curiosity rather than redirecting it to a safe, contained outlet.',
        'Leaving toilet lids up or sinks accessible unsupervised, which is more of a safety issue for this breed than most.',
      ],
      timeline: 'Redirecting water interest to a fountain or basin typically shows results within a week or two.',
    },
    {
      id: 'mainecoon-size',
      title: 'Plan for a large, food-motivated adult',
      overview:
        'Maine Coons grow slowly (often not reaching full size until 3-5 years) and can become a genuinely large adult, which affects furniture needs, litter box size, and portion control.',
      steps: [
        'Use extra-large litter boxes from early on -- standard boxes are often too small for an adult Maine Coon to comfortably use.',
        'Choose sturdy, reinforced cat trees and furniture rated for a larger cat\'s weight.',
        'Measure food portions based on target adult weight and activity level rather than free-feeding, since they can be prone to weight gain if allowed to self-regulate.',
        'Use their strong food motivation for training -- they typically respond very well to treat-based clicker training.',
      ],
      mistakes: [
        'Buying standard-sized litter boxes and furniture, then being surprised when an adult Maine Coon outgrows them.',
        'Free-feeding based on their large frame -- size doesn\'t mean unlimited calorie needs, and this breed can gain weight readily.',
      ],
      timeline: 'Expect full physical maturity over 3-5 years -- plan furniture and box sizing for the adult, not the kitten, from early on.',
    },
  ],
}
