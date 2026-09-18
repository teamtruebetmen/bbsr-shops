# Task: B5 — frontend

Implements `task_plan.txt` §7 step B5. Branch: `feat/frontend`.

## Goal

A static page that lists shops from the backend.

## What to build

Read `apiBase` from `frontend/config.js`, defaulting to
`http://localhost:3030`. Everything else derives from that — no other
hardcoded host anywhere.

Show a category list, and shop cards carrying name, category and
address.

Make the phone a `tel:` link so it dials on tap. The number is in
`phones[0].number` in E.164 form (`+919040403484`); use it as-is in the
href. Shops where `has_phone` is false, or `phones` is empty, show no
link — do not render a dead one.

Mobile-first layout. Plain HTML, CSS and JS. No framework, no build
step, no package to install. The page should open from the filesystem
or any static server and work.

Do not call Google Places, ever. The crawler is the only thing that
talks to Places. Your only network call is `GET /shops`.

## Notes on the real data

Check the backend before you design against assumptions —
`curl http://localhost:3030/shops`. As it stands:

- All 6 fixtures have `lat: null` and `lng: null`. **Distance is not
  computable.** The plan's B5 line mentions distance from browser
  geolocation; it cannot be done until records carry coordinates.
  Leave it out, do not fake it, and do not ask for the geolocation
  permission for a number you cannot compute.
- The 6 fixture categories are free text — `office supply`,
  `book store`, `sweet shop`, `electrical installation service`,
  `grocery`, `variety`. These do **not** match the 14 categories in
  §1 of the plan. Build the category list from whatever the response
  actually contains; do not hardcode a list.
- The backend filters by exact category string: `GET /shops?category=grocery`.
  Filtering client-side from one fetch is also fine for 6 shops. Either way.

## Done when

You open the page, see the 6 shops, and tapping a phone number dials.

## Boundaries

You own `frontend/`. Do not edit `backend/`, `crawler/`, `tests/` or
`data/`. If this task seems to need a change in any of those — it
should not — write the blocker in `diary/frontend.md` and stop.
