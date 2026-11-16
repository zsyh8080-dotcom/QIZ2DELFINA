import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildRunDeck,
  CLUSTER_MAPS,
  computeAnswerXp,
  computeCentroid,
  computeDistance,
  CORAL_GROWTH_DATA,
  evaluateClusterPlacement,
  evaluateMastery,
  FEATURE_POOL,
  findNearestCenter,
  FISH_LAB_EXAMPLES,
  FISH_LAB_MYSTERY,
  formatElapsedTime,
  SUPERVISED_POOL,
  toFa
} from './capstoneEngine';

test('toFa converts English digits into Persian digits accurately', () => {
  assert.equal(toFa(0), '۰');
  assert.equal(toFa(1234567890), '۱۲۳۴۵۶۷۸۹۰');
  assert.equal(toFa('مرحله 2 از 5'), 'مرحله ۲ از ۵');
});

test('buildRunDeck produces complete Island 2 summary deck covering all 4 final categories and varies across seeds', () => {
  const deckA = buildRunDeck(101);
  const deckB = buildRunDeck(202);

  assert.equal(deckA.cinemaItems.length, 4);
  assert.equal(deckA.featureItems.length, 2);
  assert.equal(deckA.supervisedItems.length, 2);
  assert.equal(new Set(deckA.supervisedItems.map((s) => s.answer)).size, 2);
  assert.equal(deckA.synthesisItems.length, 4);

  const cats = new Set(deckA.synthesisItems.map((i) => i.category));
  assert.equal(cats.size, 4);

  assert.notEqual(deckA.clusterMap.id, deckB.clusterMap.id);
  const sigA = deckA.cinemaItems.map((i) => i.id).join(',');
  const sigB = deckB.cinemaItems.map((i) => i.id).join(',');
  assert.notEqual(sigA, sigB);
});

test('FEATURE_POOL cases have valid SVG hotspot bounds and exact 2 intrinsic + 2 distractor chips', () => {
  for (const fc of FEATURE_POOL) {
    assert.equal(fc.chips.length, 4);
    assert.equal(fc.chips.filter((c) => c.intrinsic).length, 2);
    for (const chip of fc.chips) {
      assert.ok(chip.hotspot.xPct >= 10 && chip.hotspot.xPct <= 90);
      assert.ok(chip.hotspot.yPct >= 15 && chip.hotspot.yPct <= 85);
      assert.ok(chip.hotspot.shortTag.trim().length > 0);
    }
  }
  for (const sup of SUPERVISED_POOL) {
    assert.equal(sup.trainingSamples.length, 2);
    assert.ok(sup.liveOutputPreview.length > 0);
  }
});

test('Stage 3b supervised fish lab and coral growth regression data are pedagogically coherent', () => {
  assert.equal(FISH_LAB_EXAMPLES.length, 3);
  assert.ok(FISH_LAB_EXAMPLES.some((f) => f.label === FISH_LAB_MYSTERY.answer));

  assert.equal(CORAL_GROWTH_DATA.points.length, 3);
  assert.equal(CORAL_GROWTH_DATA.answerCm, 40);
  assert.ok(CORAL_GROWTH_DATA.choicesCm.includes(CORAL_GROWTH_DATA.answerCm));
});

test('computeAnswerXp awards base XP and capped combo bonus on first try', () => {
  assert.equal(computeAnswerXp(true, 1), 20);
  assert.equal(computeAnswerXp(true, 2), 25);
  assert.equal(computeAnswerXp(true, 5), 40);
  assert.equal(computeAnswerXp(true, 9), 40); // combo bonus capped at +20
  assert.equal(computeAnswerXp(false, 3), 10); // retry gives reduced base with no combo bonus
});

test('clustering nearest center, distance, separation, and dot spacing work cleanly across all maps', () => {
  for (const map of CLUSTER_MAPS) {
    const g0 = computeCentroid(map.dots.filter((d) => d.naturalGroup === 0));
    const g1 = computeCentroid(map.dots.filter((d) => d.naturalGroup === 1));

    const res = evaluateClusterPlacement(map.dots, g0, g1);
    assert.equal(res.separated, true);

    const bad = evaluateClusterPlacement(map.dots, g0, g0);
    assert.equal(bad.separated, false);

    const mysteryGroup = findNearestCenter(map.mystery, [g0, g1]);
    assert.equal(mysteryGroup, map.mystery.expectedGroup);

    // Ensure no two dots collide visually on the 0..100 grid
    for (let i = 0; i < map.dots.length; i++) {
      for (let j = i + 1; j < map.dots.length; j++) {
        assert.ok(computeDistance(map.dots[i], map.dots[j]) >= 14);
      }
      assert.ok(computeDistance(map.dots[i], map.mystery) >= 18);
    }
  }
  assert.equal(computeDistance({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
});

test('evaluateMastery maps accuracy thresholds to 1, 2, or 3 stars and level badges', () => {
  const lvl3 = evaluateMastery(14, 15);
  const lvl2 = evaluateMastery(10, 15);
  const lvl1 = evaluateMastery(5, 15);

  assert.equal(lvl3.stars, 3);
  assert.equal(lvl3.levelNumber, 3);
  assert.ok(lvl3.badgeName.includes('طلایی'));

  assert.equal(lvl2.stars, 2);
  assert.equal(lvl2.levelNumber, 2);
  assert.ok(lvl2.badgeName.includes('نقره‌ای'));

  assert.equal(lvl1.stars, 1);
  assert.equal(lvl1.levelNumber, 1);
  assert.ok(lvl1.badgeName.includes('برنزی'));

  assert.equal(formatElapsedTime(75), '۰۱:۱۵');
});
