import * as Calendar from 'expo-calendar';
import { getAttendeesForEventAsync } from 'expo-calendar/legacy';
import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

// Repro for https://github.com/expo/expo/issues/53469: on iOS the class-based
// ExpoCalendarEvent.getAttendees() returns attendee objects with no readable fields,
// while the legacy getAttendeesForEventAsync() returns them filled.
