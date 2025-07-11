// ========== Enregistrement du flag "dodge" au démarrage
Hooks.once("init", () => {
  if (!CONFIG.Token.documentClass.prototype._flagDefinitions) {
    CONFIG.Token.documentClass.prototype._flagDefinitions = {};
  }

  CONFIG.Token.documentClass.prototype._flagDefinitions["esquiveame"] = {
    dodge: {
      type: Number,
      default: 0
    }
  };
});

// ========== Ajoute le champ d'esquive dans le HUD du token (sans icône)
Hooks.on("renderTokenHUD", (hud, html, tokenData) => {
  const $html = $(html); // Conversion DOM -> jQuery

  const token = canvas.tokens.get(tokenData._id);
  if (!token) return;

  const dodge = token.document.getFlag("esquiveame", "dodge") ?? 0;

  const dodgeField = $(`
    <div class="dodge-input-wrapper" style="position: relative;">
      <input type="text" value="${dodge}"
        style="
          width: 38px;
          height: 28px;
          position: absolute;
          top: -50px;
          left: 39px;
          border: 1px solid white;
          background: rgba(0,0,0,0.7);
          color: #00ffff;
          font-weight: bold;
          font-size: 16px;
          text-align: center;
          border-radius: 4px;" />
    </div>
  `);

  const input = dodgeField.find("input");
  input.on("focus", function () { this.select(); });

  input.on("change", async function () {
    const current = token.document.getFlag("esquiveame", "dodge") ?? 0;
    let inputValue = this.value.trim();
    let newValue = current;

    if (/^[+-]\d+$/.test(inputValue)) {
      newValue = current + parseInt(inputValue);
    } else if (/^\d+$/.test(inputValue)) {
      newValue = parseInt(inputValue);
    }

    newValue = Math.max(0, newValue);

    await token.document.setFlag("esquiveame", "dodge", newValue);
    token.refresh();
  });

  $html.find(".col.left").prepend(dodgeField);
});

// ========== Affichage visuel du score d'esquive
Hooks.on("refreshToken", (token) => {
  if (token.drawDodgeLabel && typeof token.drawDodgeLabel === "function") {
    token.drawDodgeLabel(); // Supprimer l'ancien
  }

  const dodge = token.document.getFlag("esquiveame", "dodge");
  if (!dodge || dodge <= 0) return;

  const text = new PreciseText(`🌀 ${dodge}`, {
    fontSize: 20,
    fill: "#00ffff",
    stroke: "#000000",
    strokeThickness: 3,
    align: "center"
  });
  text.zIndex = 10000;

  text.x = -token.w / 4  - 5;
  text.y = -token.h / 85 - 10;

  token.addChild(text);

  token.drawDodgeLabel = () => {
    if (text && text.parent) text.parent.removeChild(text);
  };
});



















  