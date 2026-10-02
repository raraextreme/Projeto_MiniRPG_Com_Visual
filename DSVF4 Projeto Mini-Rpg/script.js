
class Character {
    constructor(name, attack, defense, health) {
        this.name = name;
        this.attack = attack;
        this.defense = defense;
        this.maxHealth = health;
        this.health = health;
        this.isDefending = false;
    }

    
    calculateDamage(target) {
        let damage = this.attack - target.defense;
        if (damage < 0) damage = 0; // nunca causa dano negativo

        
        if (target.isDefending) {
            damage = Math.floor(damage / 2);
        }
        return damage;
    }

    
    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
    }

    
    defend() {
        this.isDefending = true;
    }

  
    resetDefense() {
        this.isDefending = false;
    }

    isAlive() {
        return this.health > 0;
    }
}


class Player extends Character {
    constructor() {
        super('Herói', 25, 10, 100);
    }

   
    attackEnemy(enemy) {
        const damage = this.calculateDamage(enemy);
        enemy.takeDamage(damage);
        return damage;
    }
}


class Enemy extends Character {
    constructor(name, attack, defense, health) {
        super(name, attack, defense, health);
    }

    
    chooseAction() {
        const random = Math.random();
        if (random < 0.6) {
            return 'attack';
        } else {
            return 'defend';
        }
    }

    
    act(player) {
        const action = this.chooseAction();
        if (action === 'attack') {
            const damage = this.calculateDamage(player);
            player.takeDamage(damage);
            return `O ${this.name} atacou e causou ${damage} de dano!`;
        } else {
            this.defend();
            return `O ${this.name} se defendeu!`;
        }
    }
}


const enemyList = [
    new Enemy('Goblin', 20, 5, 80),
   
];


const player = new Player();
let currentEnemy = enemyList[0]; // escolhe o primeiro inimigo (pode ser aleatório)
let playerTurn = true;
let gameOver = false;


const playerNameEl = document.getElementById('playerName');
const playerHealthFill = document.getElementById('playerHealthFill');
const playerHpText = document.getElementById('playerHpText');

const enemyNameEl = document.getElementById('enemyName');
const enemyHealthFill = document.getElementById('enemyHealthFill');
const enemyHpText = document.getElementById('enemyHpText');

const logText = document.getElementById('logText');
const attackBtn = document.getElementById('attackBtn');
const defendBtn = document.getElementById('defendBtn');


function updateUI() {
    
    playerNameEl.textContent = player.name;
    playerHealthFill.style.width = (player.health / player.maxHealth * 100) + '%';
    playerHpText.textContent = `HP: ${player.health}/${player.maxHealth}`;

    
    enemyNameEl.textContent = currentEnemy.name;
    enemyHealthFill.style.width = (currentEnemy.health / currentEnemy.maxHealth * 100) + '%';
    enemyHpText.textContent = `HP: ${currentEnemy.health}/${currentEnemy.maxHealth}`;

    
    if (gameOver) {
        attackBtn.disabled = true;
        defendBtn.disabled = true;
    }
}

function log(message) {
    logText.textContent = message;
}


function checkGameOver() {
    if (!player.isAlive()) {
        gameOver = true;
        log(`😵 Você foi derrotado pelo ${currentEnemy.name}!`);
        updateUI();
        return true;
    }
    if (!currentEnemy.isAlive()) {
        gameOver = true;
        log(`🎉 Você derrotou o ${currentEnemy.name}!`);
        updateUI();
        return true;
    }
    return false;
}


function playerAction(action) {
    if (gameOver || !playerTurn) return;

    let message = '';

    if (action === 'attack') {
        const damage = player.attackEnemy(currentEnemy);
        message = `⚔️ Você atacou e causou ${damage} de dano!`;
    } else if (action === 'defend') {
        player.defend();
        message = '🛡️ Você se defendeu!';
    }

    log(message);
    updateUI();

   
    if (checkGameOver()) {
        playerTurn = false;
        return;
    }

   
    playerTurn = false;
    disableButtons(true);
    setTimeout(enemyTurn, 1000); // pequeno atraso para dar ritmo
}


function enemyTurn() {
    if (gameOver) return;


    player.resetDefense();
    currentEnemy.resetDefense();

    const enemyMessage = currentEnemy.act(player);
    log(`🤖 ${enemyMessage}`);

    updateUI();

  
    if (checkGameOver()) {
        playerTurn = false;
        return;
    }

   
    playerTurn = true;
    disableButtons(false);
}


function disableButtons(disabled) {
    attackBtn.disabled = disabled;
    defendBtn.disabled = disabled;
}


attackBtn.addEventListener('click', () => playerAction('attack'));
defendBtn.addEventListener('click', () => playerAction('defend'));


updateUI();
disableButtons(false);
