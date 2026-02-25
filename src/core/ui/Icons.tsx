/**
 * Icons.tsx
 * Custom icon components drawn with pure React Native View primitives.
 * No external icon library or react-native-svg required.
 *
 * Each icon accepts { size?: number; color?: string }
 */

/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
}

/* ================================================================
 * FLASH / BOLT  ⚡
 * Drawn as a stylised lightning bolt using two triangles
 * ================================================================ */
export function FlashIcon({ size = 20, color = '#FFF' }: IconProps) {
  const w = size;
  const h = size;
  return (
    <View style={{ width: w, height: h, alignItems: 'center', justifyContent: 'center' }}>
      {/* Top part of bolt */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: w * 0.28,
          borderRightWidth: w * 0.12,
          borderBottomWidth: h * 0.55,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
          transform: [{ rotate: '10deg' }],
          position: 'absolute',
          top: 0,
          left: w * 0.15,
        }}
      />
      {/* Bottom part of bolt */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: w * 0.12,
          borderRightWidth: w * 0.28,
          borderTopWidth: h * 0.55,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
          transform: [{ rotate: '10deg' }],
          position: 'absolute',
          bottom: 0,
          right: w * 0.15,
        }}
      />
    </View>
  );
}

/* ================================================================
 * FLASH OFF — bolt with diagonal strike-through
 * ================================================================ */
export function FlashOffIcon({ size = 20, color = '#FFF' }: IconProps) {
  return (
    <View style={{ width: size, height: size }}>
      <FlashIcon size={size} color={color} />
      {/* Strike-through line */}
      <View
        style={{
          position: 'absolute',
          width: size * 1.3,
          height: 2,
          backgroundColor: color,
          top: size / 2 - 1,
          left: -size * 0.15,
          transform: [{ rotate: '-45deg' }],
          borderRadius: 1,
        }}
      />
    </View>
  );
}

/* ================================================================
 * PEOPLE / FRIENDS — two person silhouettes
 * ================================================================ */
export function PeopleIcon({ size = 20, color = '#FFF' }: IconProps) {
  const headSize = size * 0.28;
  const bodyW = size * 0.36;
  const bodyH = size * 0.22;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-end' }}>
      {/* Person 1 (back, slightly left) */}
      <View style={{ position: 'absolute', left: size * 0.08, bottom: 0, alignItems: 'center' }}>
        <View style={{ width: headSize, height: headSize, borderRadius: headSize / 2, backgroundColor: color }} />
        <View
          style={{
            width: bodyW,
            height: bodyH,
            borderTopLeftRadius: bodyW / 2,
            borderTopRightRadius: bodyW / 2,
            backgroundColor: color,
            marginTop: 1,
          }}
        />
      </View>
      {/* Person 2 (front, slightly right) */}
      <View style={{ position: 'absolute', right: size * 0.08, bottom: 0, alignItems: 'center' }}>
        <View style={{ width: headSize, height: headSize, borderRadius: headSize / 2, backgroundColor: color }} />
        <View
          style={{
            width: bodyW,
            height: bodyH,
            borderTopLeftRadius: bodyW / 2,
            borderTopRightRadius: bodyW / 2,
            backgroundColor: color,
            marginTop: 1,
          }}
        />
      </View>
    </View>
  );
}

/* ================================================================
 * CHAT BUBBLE — rounded rectangle with small tail
 * ================================================================ */
export function ChatBubbleIcon({ size = 20, color = '#FFF' }: IconProps) {
  const w = size;
  const h = size * 0.78;
  const tailSize = size * 0.18;
  return (
    <View style={{ width: w, height: size, justifyContent: 'flex-start' }}>
      {/* Bubble body */}
      <View
        style={{
          width: w,
          height: h,
          borderRadius: size * 0.28,
          backgroundColor: color,
        }}
      />
      {/* Tail triangle (bottom-left) */}
      <View
        style={{
          position: 'absolute',
          bottom: size * 0.08,
          left: size * 0.18,
          width: 0,
          height: 0,
          borderLeftWidth: tailSize,
          borderRightWidth: tailSize * 0.3,
          borderTopWidth: tailSize,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
        }}
      />
    </View>
  );
}

/* ================================================================
 * GALLERY / IMAGE — stylised photo stack
 * ================================================================ */
export function GalleryIcon({ size = 28, color = '#FFF' }: IconProps) {
  const cardW = size * 0.72;
  const cardH = size * 0.72;
  const r = size * 0.12;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Back card (slightly offset) */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: cardW,
          height: cardH,
          borderRadius: r,
          borderWidth: 2,
          borderColor: color,
          opacity: 0.5,
        }}
      />
      {/* Front card */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: cardW,
          height: cardH,
          borderRadius: r,
          borderWidth: 2,
          borderColor: color,
        }}
      >
        {/* Mountain / landscape triangle */}
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden' }}>
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: cardW * 0.4,
              borderRightWidth: cardW * 0.4,
              borderBottomWidth: cardH * 0.4,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color,
              opacity: 0.4,
            }}
          />
        </View>
        {/* Sun circle */}
        <View
          style={{
            position: 'absolute',
            top: cardH * 0.18,
            right: cardW * 0.18,
            width: cardW * 0.18,
            height: cardW * 0.18,
            borderRadius: cardW * 0.09,
            backgroundColor: color,
            opacity: 0.5,
          }}
        />
      </View>
    </View>
  );
}

/* ================================================================
 * CAMERA FLIP — two curved arrows forming a circle
 * ================================================================ */
export function CameraFlipIcon({ size = 26, color = '#FFF' }: IconProps) {
  const ring = size * 0.82;
  const bw = 2.5;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Top-right arc */}
      <View
        style={{
          position: 'absolute',
          width: ring,
          height: ring,
          borderRadius: ring / 2,
          borderWidth: bw,
          borderColor: 'transparent',
          borderTopColor: color,
          borderRightColor: color,
          transform: [{ rotate: '-10deg' }],
        }}
      />
      {/* Arrow head top */}
      <View
        style={{
          position: 'absolute',
          top: size * 0.02,
          right: size * 0.12,
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.1,
          borderRightWidth: size * 0.1,
          borderBottomWidth: size * 0.15,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
          transform: [{ rotate: '40deg' }],
        }}
      />
      {/* Bottom-left arc */}
      <View
        style={{
          position: 'absolute',
          width: ring,
          height: ring,
          borderRadius: ring / 2,
          borderWidth: bw,
          borderColor: 'transparent',
          borderBottomColor: color,
          borderLeftColor: color,
          transform: [{ rotate: '-10deg' }],
        }}
      />
      {/* Arrow head bottom */}
      <View
        style={{
          position: 'absolute',
          bottom: size * 0.02,
          left: size * 0.12,
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.1,
          borderRightWidth: size * 0.1,
          borderTopWidth: size * 0.15,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
          transform: [{ rotate: '40deg' }],
        }}
      />
    </View>
  );
}

/* ================================================================
 * CAMERA — simple camera body with lens
 * ================================================================ */
export function CameraIcon({ size = 40, color = '#FFF' }: IconProps) {
  const bodyW = size * 0.82;
  const bodyH = size * 0.6;
  const lensSize = size * 0.3;
  const bumpW = size * 0.28;
  const bumpH = size * 0.14;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Top bump / viewfinder */}
      <View
        style={{
          width: bumpW,
          height: bumpH,
          borderTopLeftRadius: size * 0.04,
          borderTopRightRadius: size * 0.04,
          backgroundColor: color,
          opacity: 0.3,
          marginBottom: -1,
        }}
      />
      {/* Camera body */}
      <View
        style={{
          width: bodyW,
          height: bodyH,
          borderRadius: size * 0.1,
          borderWidth: 2,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.3,
        }}
      >
        {/* Lens circle */}
        <View
          style={{
            width: lensSize,
            height: lensSize,
            borderRadius: lensSize / 2,
            borderWidth: 2,
            borderColor: color,
          }}
        />
      </View>
    </View>
  );
}

/* ================================================================
 * CHEVRON DOWN — simple V shape
 * ================================================================ */
export function ChevronDownIcon({ size = 20, color = '#8E8E93' }: IconProps) {
  const armLen = size * 0.35;
  return (
    <View style={{ width: size, height: size * 0.6, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: armLen,
          height: armLen,
          borderBottomWidth: 2.5,
          borderRightWidth: 2.5,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
}

/* ================================================================
 * SEND / ARROW-UP — arrow pointing up (used for send)
 * ================================================================ */
export function SendIcon({ size = 20, color = '#FFF' }: IconProps) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Stem */}
      <View
        style={{
          width: 2.5,
          height: size * 0.55,
          backgroundColor: color,
          position: 'absolute',
          bottom: size * 0.1,
        }}
      />
      {/* Arrow head */}
      <View
        style={{
          width: size * 0.35,
          height: size * 0.35,
          borderTopWidth: 2.5,
          borderLeftWidth: 2.5,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
          position: 'absolute',
          top: size * 0.15,
        }}
      />
    </View>
  );
}

/* ================================================================
 * CLOSE / X — two crossed lines
 * ================================================================ */
export function CloseIcon({ size = 22, color = '#FFF' }: IconProps) {
  const bw = 2.5;
  const len = size * 0.65;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          position: 'absolute',
          width: len,
          height: bw,
          backgroundColor: color,
          borderRadius: bw / 2,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: len,
          height: bw,
          backgroundColor: color,
          borderRadius: bw / 2,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
}

/* ================================================================
 * SEND PLANE — paper plane icon (Locket send button)
 * ================================================================ */
export function SendPlaneIcon({ size = 24, color = '#FFF' }: IconProps) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Main triangle body */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.45,
          borderRightWidth: size * 0.08,
          borderBottomWidth: size * 0.25,
          borderTopWidth: size * 0.25,
          borderLeftColor: color,
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
          borderTopColor: 'transparent',
          transform: [{ rotate: '-25deg' }],
          position: 'absolute',
        }}
      />
      {/* Tail fin */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.22,
          borderRightWidth: 0,
          borderBottomWidth: size * 0.22,
          borderTopWidth: 0,
          borderLeftColor: color,
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
          borderTopColor: 'transparent',
          transform: [{ rotate: '-25deg' }],
          position: 'absolute',
          bottom: size * 0.18,
          left: size * 0.3,
          opacity: 0.7,
        }}
      />
    </View>
  );
}

/* ================================================================
 * TEXT / Aa — text editing icon
 * ================================================================ */
export function TextAaIcon({ size = 22, color = '#FFF' }: IconProps) {
  // We'll just use the View-based approach to show "Aa" styled text
  // Since this is complex to draw with Views, we use a simple approach
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Circle outline */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </View>
  );
}

/* ================================================================
 * DOWNLOAD — arrow pointing down into tray
 * ================================================================ */
export function DownloadIcon({ size = 22, color = '#FFF' }: IconProps) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Arrow stem */}
      <View
        style={{
          width: 2.5,
          height: size * 0.45,
          backgroundColor: color,
          position: 'absolute',
          top: size * 0.05,
        }}
      />
      {/* Arrow head */}
      <View
        style={{
          width: size * 0.3,
          height: size * 0.3,
          borderBottomWidth: 2.5,
          borderRightWidth: 2.5,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
          position: 'absolute',
          top: size * 0.25,
        }}
      />
      {/* Tray bottom line */}
      <View
        style={{
          position: 'absolute',
          bottom: size * 0.05,
          width: size * 0.7,
          height: 2.5,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      {/* Tray left wall */}
      <View
        style={{
          position: 'absolute',
          bottom: size * 0.05,
          left: size * 0.15,
          width: 2.5,
          height: size * 0.2,
          backgroundColor: color,
        }}
      />
      {/* Tray right wall */}
      <View
        style={{
          position: 'absolute',
          bottom: size * 0.05,
          right: size * 0.15,
          width: 2.5,
          height: size * 0.2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

/* ================================================================
 * SINGLE PERSON — one person silhouette
 * ================================================================ */
export function PersonIcon({ size = 20, color = '#FFF' }: IconProps) {
  const headSize = size * 0.34;
  const bodyW = size * 0.5;
  const bodyH = size * 0.28;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-end' }}>
      {/* Head */}
      <View
        style={{
          width: headSize,
          height: headSize,
          borderRadius: headSize / 2,
          backgroundColor: color,
          position: 'absolute',
          top: size * 0.08,
        }}
      />
      {/* Body */}
      <View
        style={{
          width: bodyW,
          height: bodyH,
          borderTopLeftRadius: bodyW / 2,
          borderTopRightRadius: bodyW / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

/* ================================================================
 * HOME — simple house shape
 * ================================================================ */
export function HomeIcon({ size = 22, color = '#FFF' }: IconProps) {
  const roofH = size * 0.38;
  const bodyW = size * 0.6;
  const bodyH = size * 0.38;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-end' }}>
      {/* Roof triangle */}
      <View
        style={{
          position: 'absolute',
          top: size * 0.05,
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.45,
          borderRightWidth: size * 0.45,
          borderBottomWidth: roofH,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        }}
      />
      {/* Body */}
      <View
        style={{
          width: bodyW,
          height: bodyH,
          backgroundColor: color,
          borderBottomLeftRadius: size * 0.04,
          borderBottomRightRadius: size * 0.04,
        }}
      />
    </View>
  );
}

/* ================================================================
 * FAMILY — three people silhouettes
 * ================================================================ */
export function FamilyIcon({ size = 22, color = '#FFF' }: IconProps) {
  const headSm = size * 0.2;
  const headLg = size * 0.24;
  const bodySm = size * 0.26;
  const bodyLg = size * 0.32;
  const bodyH = size * 0.18;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-end' }}>
      {/* Left person (small) */}
      <View style={{ position: 'absolute', left: 0, bottom: 0, alignItems: 'center' }}>
        <View style={{ width: headSm, height: headSm, borderRadius: headSm / 2, backgroundColor: color }} />
        <View
          style={{
            width: bodySm,
            height: bodyH,
            borderTopLeftRadius: bodySm / 2,
            borderTopRightRadius: bodySm / 2,
            backgroundColor: color,
            marginTop: 1,
          }}
        />
      </View>
      {/* Center person (large) */}
      <View style={{ position: 'absolute', bottom: 0, alignItems: 'center' }}>
        <View style={{ width: headLg, height: headLg, borderRadius: headLg / 2, backgroundColor: color }} />
        <View
          style={{
            width: bodyLg,
            height: bodyH * 1.1,
            borderTopLeftRadius: bodyLg / 2,
            borderTopRightRadius: bodyLg / 2,
            backgroundColor: color,
            marginTop: 1,
          }}
        />
      </View>
      {/* Right person (small) */}
      <View style={{ position: 'absolute', right: 0, bottom: 0, alignItems: 'center' }}>
        <View style={{ width: headSm, height: headSm, borderRadius: headSm / 2, backgroundColor: color }} />
        <View
          style={{
            width: bodySm,
            height: bodyH,
            borderTopLeftRadius: bodySm / 2,
            borderTopRightRadius: bodySm / 2,
            backgroundColor: color,
            marginTop: 1,
          }}
        />
      </View>
    </View>
  );
}
