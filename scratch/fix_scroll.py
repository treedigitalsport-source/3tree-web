import os

file = 'src/components/SmoothScroll.tsx'
with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

old_config = '''    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing suave
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    } as any); // cast to any if types don't exactly match installed version'''

new_config = '''    const lenis = new Lenis({
      lerp: 0.1, // Mucho más responsivo al trackpad de laptop
      wheelMultiplier: 1,
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2,
    } as any); // cast to any si cambian los tipos de lenis'''

if old_config in text:
    text = text.replace(old_config, new_config)
    with open(file, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Updated Lenis config.")
else:
    print("Could not find Lenis config.")
