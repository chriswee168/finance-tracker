import { SIGN_COLOURS } from "./constants";

/**
 * Obtain the appropriate colour and sign for the amount based on whether
 * amount is positive or negative.
 * 
 * @param {number} amount Cash amount as number.
 * @returns Colour code and sign as char.
 */
export function getColourSignAmount(amount)
{
    let sign, colour;
    if (amount > 0)
    {
        colour = SIGN_COLOURS.green;
        sign = '+';
    }
    else if (amount < 0)
    {
        colour = SIGN_COLOURS.red;
        sign = '-';
    }
    else
    {
        colour = SIGN_COLOURS.black;
        sign = '';
    }

    return [colour, sign]
}

/**
 * Obtain the appropriate colour and sign based on whether transaction option
 * is "income" or "expense".
 * 
 * @param {string} transactionOption Transaction option (income/expense).
 * @returns Colour code and sign as char.
 */
export function getColourSignTransaction(transactionOption)
{
    let sign, colour;
    switch (transactionOption)
    {
        case "income":
            colour = SIGN_COLOURS.green;
            sign = '+';
            break;
        case "expense":
            colour = SIGN_COLOURS.red;
            sign = '-';
            break;
        default:
            colour = SIGN_COLOURS.black;
            sign = '';
            break;
    }

    return [colour, sign];
}