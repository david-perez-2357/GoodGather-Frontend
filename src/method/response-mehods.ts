
function handleResponse(response: any) {
  if (response.status !== 200) {
    console.error('Error:', response);
  }
}

export { handleResponse };
