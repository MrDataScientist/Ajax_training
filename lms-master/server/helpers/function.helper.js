export const isSuccess = (response) => {
	return !(response.logs.length && response.logs[0].event === 'Status')
}

export const getRandomNumber = (min=1111111111, max=9999999999) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
