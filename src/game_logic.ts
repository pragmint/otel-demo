import { HttpError } from "./errors"
import { Logger } from "./Logger"

type Character = { 
    name: string
    level: number
    class: string
    attack_mod: number
    damage_dice: string
    damage_mod: number
}

type Monster = { 
    name: string
    monster_type: string
    health: number
    full_health: number
    ac: number
}

let _characters: Character[] = [
    { name: "Aragorn", level: 7, class: "Ranger", attack_mod: 4, damage_dice: 'd12', damage_mod: 5 },
    { name: "Arwen", level: 12, class: "Cleric", attack_mod: 1, damage_dice: 'd8', damage_mod: 2 },
]

let _monsters: Monster[] = [
    { name: "Fluffy", monster_type: "Warg", health: 40, full_health: 40, ac: 14 },
    { name: "Gus", monster_type: "Warg", health: 40, full_health: 40, ac: 14 },
    { name: "Luronk", monster_type: "Orc", health: 54, full_health: 54, ac: 14 },
    { name: "Xunag", monster_type: "Orc", health: 54, full_health: 54, ac: 14 },
]

let characters: Character[] = [
    { name: "Aragorn", level: 7, class: "Ranger", attack_mod: 4, damage_dice: 'd12', damage_mod: 5 },
    { name: "Arwen", level: 12, class: "Cleric", attack_mod: 1, damage_dice: 'd8', damage_mod: 2 },
]

let monsters: Monster[] = [
    { name: "Fluffy", monster_type: "Warg", health: 40, full_health: 40, ac: 14 },
    { name: "Gus", monster_type: "Warg", health: 40, full_health: 40, ac: 14 },
    { name: "Luronk", monster_type: "Orc", health: 54, full_health: 54, ac: 14 },
    { name: "Xunag", monster_type: "Orc", health: 54, full_health: 54, ac: 14 },
]

const getCharacter = (name: string) => characters.filter(c => c.name === name)[0]
const getMonster = (name: string) => monsters.filter(m => m.name === name)[0]
const setMonsterHealth = (name: string, health: number) => {
    monsters = monsters.map((monster) => {
        if (monster.name === name) 
            return { ...monster, health }
        return monster
    })
}
export const getCharacters = () => characters
export const getMonsters = () => monsters
export const reset = () => {
    monsters = _monsters
    characters = _characters
} 

const rollDice = async  (dice_code: string): Promise<number> => {
    const url = `${process.env.DICE_URL}/${dice_code}`
    try {
        Logger.info(`RollingDice: ${dice_code}`)
        return parseInt(await (await fetch(url)).json())
    } catch (e) {
        throw new HttpError(`Failed to roll '${dice_code}' dice.`, 500, { url })
    }
}

type AttackResult = {
    hit: boolean
    damage: number
    character: Character
    monster: Monster 
}

export const attack = async (character_name: string, monster_name: string): Promise<AttackResult> => {
    const character = getCharacter(character_name)
    const monster = getMonster(monster_name)
    const attackValue = await rollDice('d20') + character.attack_mod
    const damageValue = await rollDice(character.damage_dice) + character.damage_mod
    if (attackValue >= monster.ac) {
        setMonsterHealth(monster_name, monster.health - damageValue)
        const new_monster = getMonster(monster_name)
        return {
            hit: true,
            damage: damageValue,
            character,
            monster: new_monster, 
        }
    }
    return {
        hit: false,
        damage: 0, 
        character,
        monster, 
    }
}

export const makeAttackResponse = (attackResult: AttackResult) => {
    const { hit, character, monster, damage, } = attackResult
    if (hit) {
        Logger.debug(`HitSuccess: ${character.name} did ${damage} to ${monster.name}.`)
        return { ...attackResult, message: `Great job! ${character.name} did ${damage} to ${monster.name}.`};
    }
    Logger.debug(`HitFail: ${character.name} missed ${damage} hitting ${monster.name}.`)
    return { ...attackResult, message: `Sorry. ${character.name} missed trying to hit ${monster.name}`};
}

