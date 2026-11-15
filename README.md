# expo-calendar: `getAttendees()` returns attendees with no properties on iOS (class-based API)

Reproduction for https://github.com/expo/expo/issues/53469.

Versions: Expo SDK 58, `expo-calendar` 58.0.6, React Native 0.88, iOS 26.5 simulator (iPhone 17),
Xcode 27.2.

## Result

Same event, same three invitees, read with both APIs on iOS:

| Class-based `event.getAttendees()` | Legacy `getAttendeesForEventAsync(event.id)` |
| --- | --- |
| ![three objects with every field undefined](media/ios-result-class-api.png) | ![three objects with name, role, status, type, url, isCurrentUser](media/ios-result-legacy-api.png) |

Full screen: [media/ios-result.png](media/ios-result.png).

| | `name` | `role` | `status` | `type` | `url` | `isCurrentUser` |
| --- | --- | --- | --- | --- | --- | --- |
| class API, each of 3 objects | undefined | undefined | undefined | undefined | undefined | undefined |
| legacy, Alice Attendee | "Alice Attendee" | required | accepted | person | mailto:alice@example.com | false |
| legacy, Bob Optional | "Bob Optional" | optional | tentative | person | mailto:bob@example.com | false |
| legacy, Room 4 | "Room 4" | notParticipant | pending | resource | mailto:room4@example.com | false |

The class-API objects have no own keys at all; their prototype has only `constructor` and
`__native_constructor__`. So the call succeeds and returns one object per attendee, but nothing can
be read from them.

