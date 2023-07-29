const currencyFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ZAR",
})

export function formatCurrency(value) {
    return currencyFormat.format(value)
}