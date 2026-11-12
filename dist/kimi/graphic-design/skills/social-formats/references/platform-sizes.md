# Platform sizes and safe zones

> Platform numbers change at any time, so this file stores no pixel sizes, file limits or safe-zone figures. For each platform it says what to look up and where. Open the official page with WebSearch/WebFetch before using a number. If the page will not open, mark the value (รอยืนยัน) and tell the user to confirm on the platform before a paid campaign.

Contents: 1 Meta (Facebook + Instagram) · 2 TikTok · 3 YouTube · 4 LINE Official Account · 5 X · 6 LinkedIn · 7 Export settings

## 1 · Meta (Facebook and Instagram)

Placements to look up: feed image ad (4:5) · Stories / Reels image ad (9:16) · organic Instagram (IG) feed · organic IG story / reel · Facebook (FB) page cover · FB link preview · ad primary text and headline length.

Look up the recommended size, minimum width, file limit and the Stories/Reels safe zone (top, bottom, sides) for each placement. The desktop and mobile crops of the FB page cover differ, so centre the text. The IG profile grid previews feed posts in a different ratio from the feed itself. Look up that ratio too.

Look up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน). Sources: https://www.facebook.com/business/ads-guide/update/image · https://www.facebook.com/business/ads-guide/update/image/instagram-story · https://www.facebook.com/help/125379114252045

## 2 · TikTok

Placements to look up: organic and in-feed ad video (9:16 recommended; 1:1 and 16:9 also exist for ads) · ad file limits (size, format, bitrate, duration) · ad caption rules · in-feed safe zone.

For the safe zone, use the official in-feed template, which gives the top, bottom, side and right-strip margins on a 720 × 1280 frame. Scale the margins to the real canvas, and leave extra room for longer captions or add-ons. Third-party guides (emplifi.io · adnabu.com) leave out the right strip, so do not use them for it.

Look up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน). Source: https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads

## 3 · YouTube

Placements to look up: video thumbnail (16:9) · Shorts thumbnail (9:16) · Shorts video (9:16) and its keep-clear margins · channel banner (16:9) and its text-safe area.

For the video thumbnail, look up the maximum and minimum size, file formats, the file limit on mobile versus desktop upload, and the account-verification requirement. Design rules for the thumbnail itself are in `youtube-thumbnail`. For Shorts, Google publishes the keep-clear margins only for ads in Shorts. Say so if you quote them for organic Shorts.

Vertical videos with a 16:9 custom thumbnail get an auto-generated 4:5 thumbnail on home, explore and subscription pages. Design a vertical-safe thumbnail for vertical videos.

Look up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน). Sources: https://support.google.com/youtube/answer/72431 (thumbnail) · https://support.google.com/youtube/answer/10456525 (banner) · https://support.google.com/google-ads/answer/9128498 (Shorts margins)

## 4 · LINE Official Account (LINE OA)

Rich menu: sizes, tap-area limits, file limit and the Messaging API rules are in `line-richmenu`, which also holds the checker script. Use that skill, not this file.

Other items to look up: rich message size · profile image size and file limit · cover image size, file limit and the part covered by the account name. No official page was found for profile and cover at the last check, so mark them (รอยืนยัน) unless the LINE OA Manager upload screen states them. Old LINE news posts give outdated sizes, so ignore them.

Rich menu text: each tap area is about 1/3 of the phone width on screen. Make the Thai label at least ~80 px tall on the 2500 px canvas so it reads after scaling (house rule — test on a phone).

Look up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน). Sources: https://developers.line.biz/en/reference/messaging-api/ (rich menu) · the upload screen of LINE OA Manager (profile, cover)

## 5 · X

Items to look up: in-stream image (16:9) · ad image sizes and file limit · header (3:1) and how much is cropped at top and bottom · profile image, crop shape and file limit.

Guides disagree on the in-stream image size, and X publishes no official figure for ordinary posts. Mark that value (รอยืนยัน) unless you find one. The ad spec is official but applies to ads only.

Look up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน). Sources: https://help.x.com/en/managing-your-account/common-issues-when-uploading-profile-photo (header, profile) · https://help.x.com/en/business-and-advertising/creative-ad-specifications (ad images). help.x.com may return 403 to tools, so read the official text through search results.

## 6 · LinkedIn

Items to look up: company page logo and cover · link post image (1.91:1) · Life tab main image · personal profile background (4:1) and what the profile photo covers.

Look up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน). Source: https://www.linkedin.com/help/linkedin/answer/a563309

## 7 · Export settings that work everywhere

- Colour: sRGB; never Cyan Magenta Yellow Key (CMYK) for screens
- Photos: JPG quality 80–90; graphics with flat colour and text: PNG
- Video: H.264 MP4, 30 frames per second (fps) (or 25), AAC audio, captions burned in for sound-off viewing
- Name with platform and format codes (`asset-organize`)
