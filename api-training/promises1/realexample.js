fetch('google.com')
  .then((response) => {
    return response.json(); // converting response to json take some time too, so they made it a promise (so that other code of ours isn't stuck waiting for json convertion). so we are returning a promse.
}).then((jsonedResponse) => {
    console.log(jsonedResponse); // { data: 'someData' }
}).catch((error) => {
    // this catch will get executed if either fetch() or json() promises get rejected.
    // if we wanted to handle fetch() and json() promise rejections separately, we would place two cathes, with first one coming after fetch().
})
