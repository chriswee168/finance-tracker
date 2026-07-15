
/**
 * Function to perform a mathematical operation between two numbers.
 * 
 * @param {number} num1 Number 1.
 * @param {number} num2 Number 2.
 * @param {number} operator Operator (0 = add, 1 = subtract).
 * @param {number} dp Decimal places for output result.
 * 
 * @returns Calculated result.
 */
export default function twoNumOp(num1, num2, operator, dp)
{
  let result;
  switch (operator)
  {
    case 0:
      result = num1 + num2;
      break;
    case 1:
      result = num1 - num2;
      break;
  }

  return result.toFixed(dp);
}