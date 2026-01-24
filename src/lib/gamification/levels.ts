// XP Table
// Level 1: 0 - 500
// Level 2: 501 - 1200
// Level 3: 1201 - 2500
// ...

export const LEVEL_THRESHOLDS = [
    0,      // Lvl 1
    500,    // Lvl 2
    1500,   // Lvl 3
    3000,   // Lvl 4
    5000,   // Lvl 5 (Socio)
    8000,   // Lvl 6
    12000,  // Lvl 7
    17000,  // Lvl 8 (Magistrado)
    23000,  // Lvl 9
    30000   // Lvl 10 (Leyenda)
];

export function calculateLevel(xp: number): number {
    let level = 1;
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
        if (xp >= LEVEL_THRESHOLDS[i]) {
            level = i + 1;
        } else {
            break;
        }
    }
    return level;
}

export function getXPForNextLevel(currentLevel: number): number {
    if (currentLevel >= LEVEL_THRESHOLDS.length) return 100000; // Cap
    return LEVEL_THRESHOLDS[currentLevel];
}

export function getLevelTitle(level: number): string {
    if (level < 3) return "Asociado Junior";
    if (level < 5) return "Asociado Senior";
    if (level < 8) return "Socio Fundador";
    if (level < 10) return "Magistrado";
    return "Leyenda Legal";
}
