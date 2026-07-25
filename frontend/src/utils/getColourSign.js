import { SIGN_COLOURS } from "./constants";

/**
 * Obtain the appropriate colour and sign for the amount based on whether
 * amount is positive or negative.
 * 
 * @param {number} amount Cash amount as number.
 * @returns Colour code and sign as char.
 */
export default function getColourSign(amount)
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