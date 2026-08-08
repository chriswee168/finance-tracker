/**
 * Function to perform a mathematical operation between two numbers.
 * 
 * @param {number} num1 Number 1.
 * @param {number} num2 Number 2.
 * @param {string} transactionOption Transaction option (income/expense).
 * @param {number} dp Decimal places for output result.
 * 
 * @returns Calculated result.
 */
export default function twoNumOp(num1, num2, transactionOption, dp)
{
  let result;
  switch (transactionOption)
  {
    case "income":
      result = num1 + num2;
      break;
    case "expense":
      result = num1 - num2;
      break;
  }

  return Number(result.toFixed(dp));
}