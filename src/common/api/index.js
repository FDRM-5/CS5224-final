import * as R from "ramda";

// const API_URL = process.env.API_DOMAIN_NAME;
const API_URL = "http://localhost:3000";

const parse = R.ifElse(
	R.prop("ok"),
	(response) => response.json().then(({ body }) => JSON.parse(body)),
	(response) => ({
		error: { code: response.status, message: response.statusText },
	})
);

const httpGet = R.curry((url) =>
	fetch(`${API_URL}/${url}`, {
		method: "GET",
	}).then(parse)
);

const httpPost = R.curry((url, body) =>
	fetch(`${API_URL}/${url}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	}).then(parse)
);

const httpPut = R.curry((url, body) =>
	fetch(`${API_URL}/${url}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	}).then(parse)
);

const httpDelete = R.curry((url) =>
	fetch(`${API_URL}/${url}`, {
		method: "DELETE",
	}).then(parse)
);

export { httpGet, httpPost, httpPut, httpDelete };
