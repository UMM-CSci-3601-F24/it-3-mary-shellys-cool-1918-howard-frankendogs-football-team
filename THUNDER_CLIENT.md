# Thunder Client <!-- omit in toc -->

Thunder Client is a tool for debugging the server API output from VS Code.
It aids in checking what the server gives us when we make requests to it, which can be
really helpful when you're trying to debug what your server gives you.

- [Use Thunder Client to explore API output](#use-thunder-client-to-explore-api-output)
- [`GET` Requests](#get-requests)
- [`POST` Requests](#post-requests)
- [`PUT` Requests](#put-requests)


## Use Thunder Client to explore API output

To use Thunder Client (once the extension is installed in VS Code), open it from the sidebar.
The icon is a circle with a lightning bolt in the middle.

<img src = "https://user-images.githubusercontent.com/32685970/214179360-2ab176da-dc4f-43f8-8519-4ade1660ef89.png" height = 300 />

This should add a button in the top of the sidebar labelled `New Request`, click it.

![Thunder client startup screen](https://user-images.githubusercontent.com/32685970/214179462-d89c738c-7ab3-4ede-99a8-a3c240169884.png)

This should open a window with two columns. In the top of the left column,
there should be a URL bar with a url, (by default, it's `https://www.thunderclient.com/welcome`). 
Change that to `http://localhost:4567/api/<the-route-you-want-to-test>` (ie. `http://localhost:4567/api/users`), then press send. The response will be on the right column. 

## `GET` Requests
![Thunder client usage](https://user-images.githubusercontent.com/32685970/214179602-528f347b-b825-4446-9c91-d6671d8ad0bb.png)

By default, the type of request you are exploring is a `GET` request. You can see the type of request to the left of the URL. You can also change the query parameters of the request from this window (below the URL). Type in the name of the parameter and the value to send in the request. You can deselect the box to the left of a parameter you have entered to send the request without the parameter. This allows you to send different combinations of parameters in your query.


## `POST` Requests

Thunder client, in addition to testing `GET` requests and showing you the API output, can also test `POST` or `PUT` requests similarly. The process of testing `POST` and `PUT` requests is very similar, since both require sending a request body. The iteration template uses a `POST` request to add a new user, so the example below will walk through sending a `POST` request through Thunder Client.

Starting with an empty database (dropped table without reseeding), the client has an empty list.
![Empty User List](https://user-images.githubusercontent.com/32685970/218516124-da1252d3-f38f-4600-8af4-2853f6cc2bfb.png)

Then, if we go to Thunder Client, and create a new request (as described above), we have the following: (setting the destination URL to our server at `http://localhost:4567`).
![New request window](https://user-images.githubusercontent.com/32685970/218516615-75bb0dd4-d1d5-4f76-93da-69040c190709.png)
In this case, we're going to query `http://localhost:4567/api/users` with a `POST` request.
Once the request window is open, go to the left of the entry URL, and set the request method to `POST`.
![Set method to POST](https://user-images.githubusercontent.com/32685970/218516970-32057de1-1da5-4915-bf7e-bd41cfbe9e02.png)

Now, we want to enter the request body, in this case a User object. Since we're sending this over the network, we need to send the user as a JSON object, which needs to have fields matching the fields defined in `User.ts`. (Don't include an id, since Mongo generates that for you). To edit the request body, click on the 'Body' tab in the top left column. 
![Editing the request body](https://user-images.githubusercontent.com/32685970/218517277-16c923b0-c620-45f9-83b1-653267e71aa1.png)

Then, enter the JSON object for your user in the main input area down below. When that's done, send the request, and the response is on the right.
![Send POST request](https://user-images.githubusercontent.com/32685970/218517801-63aa6065-0b73-4411-bfa8-20d4075aa3ce.png)

After sending, the response here is
![Response](https://user-images.githubusercontent.com/32685970/218518046-0b0a20d5-c70b-4c38-8d96-9405c0177c22.png)

Note that the server returned the id of the newly created user, which is now the MongoID of that user that can be used to reference the user.

We can verify that this actually added the user like we intended by loading the user list, and we can see that there is a new user with the data we provided in the request.
![New user list](https://user-images.githubusercontent.com/32685970/218518453-31014033-ab4c-4884-9336-c26ce0713883.png)
![New user profile](https://user-images.githubusercontent.com/32685970/218518573-ce0242ff-d82a-4007-a085-33cf798a5937.png)

## `PUT` Requests
To use a `PUT` request instead of a `POST` request, change the request type in Thunder Client, and make sure that the route you're sending the request to is setup to handle a `PUT` request. Otherwise the process is the same, where you add a request body then expect a different response.
