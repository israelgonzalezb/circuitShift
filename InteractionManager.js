class InteractionManager {
    constructor(player, options) {
        this.player = player;
        this.circuitManager = options;
    }

    update(delta) {
        // Update logic for interactions
        if (this.circuitManager && this.circuitManager.activeCircuit) {
            // Check if the circuit has the checkInteractions method
            if (typeof this.circuitManager.activeCircuit.checkInteractions === 'function') {
                this.circuitManager.activeCircuit.checkInteractions(this.player);
            }
            // Call handleInteraction method if it exists
            else if (typeof this.circuitManager.activeCircuit.handleInteraction === 'function') {
                // Pass interact action when E key is pressed
                if (this.player.keys.interact) {
                    this.circuitManager.activeCircuit.handleInteraction('interact', {
                        player: this.player,
                        position: this.player.getPosition()
                    });
                }
                
                // Pass circuit action when F key is pressed
                if (this.player.keys.action) {
                    this.circuitManager.activeCircuit.handleInteraction('action', {
                        player: this.player,
                        position: this.player.getPosition()
                    });
                }
            }
        }
    }
} 