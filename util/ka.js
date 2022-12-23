/**
 *
 * @param {String} kaid - Includes "kaid_" prefix
 * @returns An object with the user's profile
 */
async function getUserProfile(kaid) {
  let res = await fetch(
    "https://www.khanacademy.org/api/internal/graphql/getFullUserProfile?curriculum=us-cc&lang=en&_=221222-1116-dcedd2200b0c_1671742656284",
    {
      headers: {},
      body: `{"operationName":"getFullUserProfile","variables":{"kaid":"${kaid}"},"query":"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    kaid\\n    key\\n    userId\\n    email\\n    username\\n    profileRoot\\n    gaUserId\\n    qualarooId\\n    isPhantom\\n    isDeveloper: hasPermission(name: \\"can_do_what_only_admins_can_do\\")\\n    isCurator: hasPermission(name: \\"can_curate_tags\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isCreator: hasPermission(name: \\"has_creator_role\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isPublisher: hasPermission(name: \\"can_publish\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isModerator: hasPermission(name: \\"can_moderate_users\\", scope: GLOBAL)\\n    isParent\\n    isSatStudent\\n    isTeacher\\n    isDataCollectible\\n    isChild\\n    isOrphan\\n    isCoachingLoggedInUser\\n    canModifyCoaches\\n    nickname\\n    hideVisual\\n    joined\\n    points\\n    countVideosCompleted\\n    bio\\n    profile {\\n      accessLevel\\n      __typename\\n    }\\n    soundOn\\n    muteVideos\\n    showCaptions\\n    prefersReducedMotion\\n    noColorInVideos\\n    autocontinueOn\\n    newNotificationCount\\n    canHellban: hasPermission(name: \\"can_ban_users\\", scope: GLOBAL)\\n    canMessageUsers: hasPermission(name: \\"can_send_moderator_messages\\", scope: GLOBAL)\\n    isSelf: isActor\\n    hasStudents: hasCoachees\\n    hasClasses\\n    hasChildren\\n    hasCoach\\n    badgeCounts\\n    homepageUrl\\n    isMidsignupPhantom\\n    includesDistrictOwnedData\\n    canAccessDistrictsHomepage\\n    preferredKaLocale {\\n      id\\n      kaLocale\\n      status\\n      __typename\\n    }\\n    underAgeGate {\\n      parentEmail\\n      daysUntilCutoff\\n      approvalGivenAt\\n      __typename\\n    }\\n    authEmails\\n    signupDataIfUnverified {\\n      email\\n      emailBounced\\n      __typename\\n    }\\n    pendingEmailVerifications {\\n      email\\n      __typename\\n    }\\n    tosAccepted\\n    shouldShowAgeCheck\\n    __typename\\n  }\\n  actorIsImpersonatingUser\\n}\\n"}`,
      method: "POST",
    }
  );
  let json = await res.json();
  return json.data.user;
}

async function generateKAAS(username, password) {
  let res = await fetch(
    "https://www.khanacademy.org/api/internal/graphql/loginWithPasswordMutation?curriculum=us-cc&lang=en&_=221222-1116-dcedd2200b0c_1671781802944",
    {
      credentials: "include",
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,es-US;q=0.8,es;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua":
          '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-ka-fkey":
          "1.0_3av7927njlcv61jd0h2v1861v3f1i1doah2opr3k019p5850jj6eon4ffj7a3hhvk5c_1671783617109",
        cookie:
          'just_logged_out="2022-12-23 08:20:16.670825262 +0000 UTC m=+43527.265223694"; G_ENABLED_IDPS=google; GOOGAPPUID=x; gae_b_id=!$-T8UB8uehcIIB-_sWdN9pOtPZO4zsc4tM95loAhltiM.~rnc4ht~1$a2FpZF8zNzA0NzY2Njg1NjAyODkzODcwOTYyMzAz; fkey=1.0_3av7927njlcv61jd0h2v1861v3f1i1doah2opr3k019p5850jj6eon4ffj7a3hhvk5c_1671783617109; LAST_SEEN_DONATION_BANNER_ID=EOY 2022 with Sal image',
        Referer: "https://www.khanacademy.org/login",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      referrer:
        "https://www.khanacademy.org/login?continue=%2Fcomputer-programming%2Fnew%2Fpjs",
      body: `{"operationName":"loginWithPasswordMutation","variables":{"identifier":"${username}","password":"${password}"},"query":"mutation loginWithPasswordMutation($identifier: String!, $password: String!) {\\n  loginWithPassword(identifier: $identifier, password: $password) {\\n    user {\\n      id\\n      kaid\\n      canAccessDistrictsHomepage\\n      isTeacher\\n      hasUnresolvedInvitations\\n      transferAuthToken\\n      preferredKaLocale {\\n        id\\n        kaLocale\\n        status\\n        __typename\\n      }\\n      __typename\\n    }\\n    isFirstLogin\\n    error {\\n      code\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`,
      method: "POST",
      mode: "cors",
    }
  );

  if (res.status !== 200) {
    throw new Error("Invalid credentials");
  }

  // Get KAAS
  let allCookiesSet = res.headers.get("set-cookie");
  let kaas = allCookiesSet.split("KAAS=")[1].split(";")[0];
  return kaas;
}

async function createProgram(title, code, kaas) {
  let res = await fetch(
    "https://www.khanacademy.org/api/internal/graphql/createProgram?lang=en&curriculum=us-cc&_=221222-1116-dcedd2200b0c_1671781999781",
    {
      credentials: "include",
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,es-US;q=0.8,es;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua":
          '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-ka-fkey":
          "1.0_3av7927njlcv61jd0h2v1861v3f1i1doah2opr3k019p5850jj6eon4ffj7a3hhvk5c_1671783617109",
        cookie: `G_ENABLED_IDPS=google; GOOGAPPUID=x; fkey=1.0_3av7927njlcv61jd0h2v1861v3f1i1doah2opr3k019p5850jj6eon4ffj7a3hhvk5c_1671783617109; LAST_SEEN_DONATION_BANNER_ID=EOY 2022 with Sal image; KAAS=${kaas}; KAAL=$w5Vc0eYuvAC1h3IeE0PVFI8_O1qTNqrJBuuXUh9Lljs.~rnc52j$a2FpZF83OTQ5MjY0NTU1ODc5ODU3NDU5MTE0Mw*; KAAC=$7lbNxHPs8dI4EbtSLyh4TwV-ZcCbEP34u2Wf0GcBTL8.~rnc52j$a2FpZF83OTQ5MjY0NTU1ODc5ODU3NDU5MTE0Mw*$X2dhZV9iaW5nb19yYW5kb206Sm42SVdNZTNlM0VRdHBkdEpsTGxObTEtd1pPRDlWdlhfcEhRaDh4NQ!0!0!0~2`,
        Referer: "https://www.khanacademy.org/computer-programming/new/pjs",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      referrer: "https://www.khanacademy.org/computer-programming/new/pjs",
      body: `{"operationName":"createProgram","query":"mutation createProgram($title: String!, $userAuthoredContentType: UserAuthoredContentType!, $revision: ProgramRevisionInput!, $curationNodeSlug: String!) {\\n  createProgram(title: $title, userAuthoredContentType: $userAuthoredContentType, revision: $revision, curationNodeSlug: $curationNodeSlug) {\\n    program {\\n      ...Program\\n      __typename\\n    }\\n    error {\\n      code\\n      debugMessage\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment Program on Program {\\n  id\\n  latestRevision {\\n    id\\n    code\\n    __typename\\n  }\\n  title\\n  url\\n  userAuthoredContentType\\n  __typename\\n}\\n","variables":{"title":${JSON.stringify(
        title
      )},"userAuthoredContentType":"PJS","revision":{"code":${JSON.stringify(
        code
      )},"folds":[],"imageUrl":"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==","configVersion":4},"curationNodeSlug":"computer-programming"}}`,
      method: "POST",
      mode: "cors",
    }
  );
  let json = await res.json();
  let program = json.data.createProgram.program;
  return program;
}
fetch(
  "https://www.khanacademy.org/api/internal/graphql/createProgram?lang=en&curriculum=us-cc&_=221222-1116-dcedd2200b0c_1671784392094",
  {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9,es-US;q=0.8,es;q=0.7",
      "content-type": "application/json",
      "sec-ch-ua":
        '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-ka-fkey":
        "1.0_3av7927njlcv61jd0h2v1861v3f1i1doah2opr3k019p5850jj6eon4ffj7a3hhvk5c_1671783617109",
      cookie:
        "G_ENABLED_IDPS=google; GOOGAPPUID=x; fkey=1.0_3av7927njlcv61jd0h2v1861v3f1i1doah2opr3k019p5850jj6eon4ffj7a3hhvk5c_1671783617109; LAST_SEEN_DONATION_BANNER_ID=EOY 2022 with Sal image; KAAS=LXNKhOjJaz5faLX4va-Zzw; KAAL=$w5Vc0eYuvAC1h3IeE0PVFI8_O1qTNqrJBuuXUh9Lljs.~rnc52j$a2FpZF83OTQ5MjY0NTU1ODc5ODU3NDU5MTE0Mw*; KAAC=$7lbNxHPs8dI4EbtSLyh4TwV-ZcCbEP34u2Wf0GcBTL8.~rnc52j$a2FpZF83OTQ5MjY0NTU1ODc5ODU3NDU5MTE0Mw*$X2dhZV9iaW5nb19yYW5kb206Sm42SVdNZTNlM0VRdHBkdEpsTGxObTEtd1pPRDlWdlhfcEhRaDh4NQ!0!0!0~2",
      Referer: "https://www.khanacademy.org/computer-programming/new/pjs",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    method: "POST",
  }
);
// POST /api/internal/graphql/createProgram?lang=en&curriculum=us-cc&_=221222-1116-dcedd2200b0c_1671781999781 HTTP/2
// Host: www.khanacademy.org
// User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:107.0) Gecko/20100101 Firefox/107.0
// Accept: */*
// Accept-Language: en-US,en;q=0.5
// Accept-Encoding: gzip, deflate, br
// Referer: https://www.khanacademy.org/computer-programming/new/pjs
// content-type: application/json
// x-ka-fkey: 1.0_g8o6622beovoo2pa1dv4tnrs4f2habct73gmu3omu6e2871ktbj9e2cmds0i28qidbj_1671781736248
// Content-Length: 2727
// Origin: https://www.khanacademy.org
// Connection: keep-alive
// Cookie: _gcl_au=1.1.1292020558.1671781736; fkey=1.0_g8o6622beovoo2pa1dv4tnrs4f2habct73gmu3omu6e2871ktbj9e2cmds0i28qidbj_1671781736248; _ga_19G17DJYEE=GS1.1.1671781736.1.1.1671781804.0.0.0; _ga=GA1.2.1761141731.1671781736; _gid=GA1.2.1464391372.1671781737; LAST_SEEN_DONATION_BANNER_ID=EOY 2022 with Sal image; G_ENABLED_IDPS=google; KAAL=$0uWMYhvPVo2B1gPd8vzB7X4va56US6cTrH9Sytd4auA.~rnc33g$a2FpZF81MTIwMjMzNTUyNDQxODMxMzU2NTQyMjU5*; KAAC=$59Zccy-VtKlBPL9iPiiXz4aH9M-MhfI_pUYrUAGa2es.~rnc33g$a2FpZF81MTIwMjMzNTUyNDQxODMxMzU2NTQyMjU5*$a2FpZF81MTIwMjMzNTUyNDQxODMxMzU2NTQyMjU5!0!0!0~2; KAAS=VLLBE1DRpT0YdYEK97EQCA
// Sec-Fetch-Dest: empty
// Sec-Fetch-Mode: cors
// Sec-Fetch-Site: same-origin
// TE: trailers

// Reponse cookies on login

// HTTP/2 200 OK
// content-type: application/json; charset=utf-8
// cache-control: no-store, private
// set-cookie: KAAL=$cHf6IEjR5caz2t2mO4FbjHV5Zonr_gy40_9cQNnGqWo.~rnc3tb$a2FpZF81MTIwMjMzNTUyNDQxODMxMzU2NTQyMjU5*; Path=/; Expires=Sun, 22 Dec 2024 08:05:35 GMT; Max-Age=63072000; HttpOnly; Secure; SameSite=Lax
// KAAC=$MBTErq_YgH-madPlSB9nUhdWd2jWeKK2mMVuwCHuubg.~rnc3tb$a2FpZF81MTIwMjMzNTUyNDQxODMxMzU2NTQyMjU5*$a2FpZF81MTIwMjMzNTUyNDQxODMxMzU2NTQyMjU5!0!0!0~2; Path=/; Expires=Sun, 22 Dec 2024 08:05:35 GMT; Max-Age=63072000; Secure; SameSite=Lax
// KAAS=A8W-fvtZ3Cx0uDMhmkwcVw; Path=/; Expires=Sun, 22 Dec 2024 08:05:35 GMT; Max-Age=63072000; HttpOnly; Secure; SameSite=Lax
// gae_b_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly; Max-Age=0; Path=/
// x-ka-bingo-id: kaid_5120233552441831356542259
// x-ka-has-any-permissions: false
// x-ka-is-phantom: false
// x-ka-kaid: kaid_5120233552441831356542259
// x-ka-may-be-under13: false
// content-encoding: gzip
// x-cloud-trace-context: c15bda699e81d78616ea8129e4d50670;o=3
// expires: Fri, 23 Dec 2022 08:05:35 GMT
// accept-ranges: bytes
// date: Fri, 23 Dec 2022 08:05:35 GMT
// vary: Accept-Encoding, Accept-Encoding
// strict-transport-security: max-age=31536000; includeSubDomains; preload
// X-Firefox-Spdy: h2

export { getUserProfile, createProgram, generateKAAS };

// fetch(
//   "https://www.khanacademy.org/api/internal/graphql/loginWithPasswordMutation?curriculum=us-cc&lang=en&_=221222-1116-dcedd2200b0c_1671783629973",
//   {
//     headers: {
//       accept: "*/*",
//       "accept-language": "en-US,en;q=0.9,es-US;q=0.8,es;q=0.7",
//       "content-type": "application/json",
//       "sec-ch-ua":
//         '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
//       "sec-ch-ua-mobile": "?0",
//       "sec-ch-ua-platform": '"Linux"',
//       "sec-fetch-dest": "empty",
//       "sec-fetch-mode": "cors",
//       "sec-fetch-site": "same-origin",
//       "x-ka-fkey":
//         "1.0_3av7927njlcv61jd0h2v1861v3f1i1doah2opr3k019p5850jj6eon4ffj7a3hhvk5c_1671783617109",
//       cookie:
//         'just_logged_out="2022-12-23 08:20:16.670825262 +0000 UTC m=+43527.265223694"; G_ENABLED_IDPS=google; GOOGAPPUID=x; gae_b_id=!$-T8UB8uehcIIB-_sWdN9pOtPZO4zsc4tM95loAhltiM.~rnc4ht~1$a2FpZF8zNzA0NzY2Njg1NjAyODkzODcwOTYyMzAz; fkey=1.0_3av7927njlcv61jd0h2v1861v3f1i1doah2opr3k019p5850jj6eon4ffj7a3hhvk5c_1671783617109; LAST_SEEN_DONATION_BANNER_ID=EOY 2022 with Sal image',
//       Referer: "https://www.khanacademy.org/login",
//       "Referrer-Policy": "strict-origin-when-cross-origin",
//     },
//     method: "POST",
//   }
// );
