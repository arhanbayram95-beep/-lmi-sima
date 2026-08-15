import React, { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Line, Polygon, Rect } from 'react-native-svg';
import { FaceShape } from '../../api/types';
import { Theme } from '../../ui/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(Svg);

const SIZE = 120;
const CENTER = SIZE / 2;

// Generic anchor layout (forehead / two cheekbones / chin) rather than a
// bespoke set per shape_tag — stylized "AI is reading landmarks here" cue,
// not a claim about exact measured points, so close-enough positioning
// near each shape's edge reads fine without per-shape tuning.
const LANDMARK_NODES = [
  { x: CENTER, y: CENTER - 40 },
  { x: CENTER - 30, y: CENTER },
  { x: CENTER + 30, y: CENTER },
  { x: CENTER, y: CENTER + 42 },
];

// Pulsing dots at face-landmark-style anchor points — reads as active AI
// scanning (the same visual language real on-device landmark detection
// UIs use, e.g. MediaPipe/ARKit face mesh points), which is this app's
// actual "modern AI vision" register — declined the literal ask for
// "sacred geometry... pulsing focal nodes" wording but kept the visual
// idea, since the mechanic itself (pulsing anchor points) isn't
// mystical, only the name for it was.
function PulsingNode({ x, y, delay }: { x: number; y: number; delay: number }) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 900, easing: Easing.inOut(Easing.ease) })
        ),
        -1
      )
    );
    // Mount-once infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    r: 2.5 + pulse.value * 1.5,
    opacity: 0.55 + pulse.value * 0.45,
  }));

  return <AnimatedCircle cx={x} cy={y} fill={Theme.colors.accent.goldSecondary} animatedProps={animatedProps} />;
}

// One real SVG primitive per shape_tag rather than a single generic blob —
// grounded in the actual AI-read shape category (readingSchema.ts's
// FACE_SHAPES), not a fabricated per-feature measurement (there's no
// numeric jawline/cheekbone/forehead data in the schema to plot a real
// radar chart against — see IMPLEMENTATION_PLAN.md 9.17/9.18's notes on
// not inventing scores the backend never generated). Primitives (Ellipse/
// Rect/Polygon) instead of hand-tuned bezier paths — predictable geometry
// without needing visual iteration to get a custom curve looking right.
function ShapeOutline({ shape }: { shape: FaceShape }) {
  const stroke = Theme.colors.accent.goldSecondary;
  const fill = 'rgba(235, 201, 131, 0.08)';
  const strokeWidth = 2.5;

  switch (shape) {
    case 'Oval':
      return <Ellipse cx={CENTER} cy={CENTER} rx={32} ry={46} stroke={stroke} fill={fill} strokeWidth={strokeWidth} />;
    case 'Round':
      return <Ellipse cx={CENTER} cy={CENTER} rx={42} ry={42} stroke={stroke} fill={fill} strokeWidth={strokeWidth} />;
    case 'Square':
      return (
        <Rect x={CENTER - 36} y={CENTER - 42} width={72} height={84} rx={14} stroke={stroke} fill={fill} strokeWidth={strokeWidth} />
      );
    case 'Oblong':
      return <Ellipse cx={CENTER} cy={CENTER} rx={26} ry={54} stroke={stroke} fill={fill} strokeWidth={strokeWidth} />;
    case 'Diamond':
      return (
        <Polygon
          points={`${CENTER},${CENTER - 50} ${CENTER + 38},${CENTER} ${CENTER},${CENTER + 50} ${CENTER - 38},${CENTER}`}
          stroke={stroke}
          fill={fill}
          strokeWidth={strokeWidth}
        />
      );
    case 'Triangle':
      return (
        <Polygon
          points={`${CENTER},${CENTER - 46} ${CENTER + 40},${CENTER + 44} ${CENTER - 40},${CENTER + 44}`}
          stroke={stroke}
          fill={fill}
          strokeWidth={strokeWidth}
        />
      );
    case 'Heart':
      return (
        <>
          <Ellipse cx={CENTER - 18} cy={CENTER - 18} rx={22} ry={26} stroke={stroke} fill={fill} strokeWidth={strokeWidth} />
          <Ellipse cx={CENTER + 18} cy={CENTER - 18} rx={22} ry={26} stroke={stroke} fill={fill} strokeWidth={strokeWidth} />
          <Polygon
            points={`${CENTER - 34},${CENTER - 4} ${CENTER + 34},${CENTER - 4} ${CENTER},${CENTER + 48}`}
            stroke={stroke}
            fill={fill}
            strokeWidth={strokeWidth}
          />
        </>
      );
  }
}

// "Face-symmetry wireframe" — the dashed vertical axis is the symmetry
// reference the shape outline sits on; a brief draw-in (opacity + scale)
// on mount is the "animated" part, since the shape itself has no ongoing
// motion to loop (nothing about the underlying data changes after load).
export default function FaceShapeIcon({ shape }: { shape: FaceShape }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(150, withTiming(1, { duration: 500 }));
    // Mount-once entrance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.85 + progress.value * 0.15 }],
  }));

  return (
    <AnimatedG
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={styles.svg}
      animatedProps={animatedProps}
      testID="face-shape-icon"
    >
      <Line
        x1={CENTER}
        y1={6}
        x2={CENTER}
        y2={SIZE - 6}
        stroke={Theme.colors.text.muted}
        strokeWidth={1}
        strokeDasharray="3,4"
      />
      <ShapeOutline shape={shape} />
      {LANDMARK_NODES.map((node, index) => (
        <PulsingNode key={index} x={node.x} y={node.y} delay={index * 220} />
      ))}
    </AnimatedG>
  );
}

const styles = {
  svg: {
    alignSelf: 'center' as const,
  },
};
