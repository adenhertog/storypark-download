# Storypark Download

Storypark only allows administrators the option to export storypark data. If you're a parent then the only way to store
photos of your child from daycare is to manually download the thousands of photos provided or order a photo book.

This tool downloads all of the images from your storypark account to your computer so you can do what you like.

## Requirements

You'll need to have the following installed on your machine:

* Node v12+
* Pnpm v6+

## Installation

Install and build the package:

```sh
pnpm i
pnpm run build
```

## Running

You'll need to provide two settings: your child's storypark ID and a current cookie to authenticate requests.

**Getting a storypark Id**

Log into https://app.storypark.com and navigate to the stories section for your child. The url will look like:

`https://app.storypark.com/children/1111111/stories`

The numbers in the URL are your child's ID. 

**Getting a valid cookie**

Whilst still on the same page:

* bring up the inspector in Chrome (right click -> Inspect).
* click the 'Network' tab
* click the 'Fetch/XHR' tab
* click the first request in the list
* click 'Headers' and expand the 'Request Headers' section
* copy the entire value of the 'cookie' attribute

To run, start the app with the following values:

```sh
SP_COOKIE="{your cookie value}" SP_CHILD_ID="{your child id}" pnpm run start
```

Once complete, your images should be available in `dist/images`
