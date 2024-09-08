const plugin = require('tailwindcss/plugin')

module.exports = plugin(function ({ addComponents, theme }) {
    const expandablePill = {
        '.expandable-pill': {
            // ... (код компонента из предыдущего ответа)
        }
    }

    addComponents(expandablePill)
})