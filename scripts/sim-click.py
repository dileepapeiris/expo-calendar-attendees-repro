# Clicks a point on the iPhone simulator shown in Xcode 27's DeviceHub window, given the point in
# `xcrun simctl io <udid> screenshot` pixels. Needs pyobjc-framework-Quartz and Accessibility
# access for the terminal. Used to tap through Calendar's subscription sheet from a script.
# Usage: python3 sim-click.py <udid> "<window name>" <px> <py> [<shot.png>]
import subprocess, sys, time
import Quartz

udid, window, px, py = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
geometry = subprocess.run(
    ['osascript', '-e', f'tell application "System Events" to tell process "DeviceHub" to get {{position, size}} of window "{window}"'],
    capture_output=True, text=True).stdout
wx, wy, ww, wh = [float(v) for v in geometry.replace(',', ' ').split()]
# The device screen is drawn inside a bezel; measured for the iPhone 17 window (395 x 860 pt).
x = wx + 30 + px * 335 / 1206
y = wy + 67.5 + py * 732 / 2622
subprocess.run(['osascript', '-e', 'tell application "DeviceHub" to activate'], capture_output=True)
time.sleep(0.4)
point = Quartz.CGPointMake(x, y)
for kind in (Quartz.kCGEventMouseMoved, Quartz.kCGEventLeftMouseDown, Quartz.kCGEventLeftMouseUp):
    Quartz.CGEventPost(Quartz.kCGHIDEventTap, Quartz.CGEventCreateMouseEvent(None, kind, point, Quartz.kCGMouseButtonLeft))
    time.sleep(0.08)
print(f'clicked px({px:.0f},{py:.0f}) -> screen({x:.0f},{y:.0f})')
if len(sys.argv) > 5:
    time.sleep(2)
    subprocess.run(['xcrun', 'simctl', 'io', udid, 'screenshot', sys.argv[5]], capture_output=True)
