import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.GITHUB_BRANCH;

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "./",
    basePath: "jonPaulWallace"
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "./assets",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "about",
        label: "About Section",
        path: "_data/about",
        format: "yaml",
        fields: [
          {
            name: "title",
            label: "Title",
            type: "string",
          },
          {
            name: "aboutIntro",
            label: "Intro Text",
            type: "string"
          },
          {
            name: "aboutPhoto",
            label: "Photo",
            type: "image"
          },
          {
            name: "aboutShowMoreButtonText",
            label: "Show More Button Text",
            type: "string"
          },
          {
            name: "aboutHideInfoButtonText",
            label: "Hide Info Button Text",
            type: "string"
          },
          {
            name: "aboutBlurb",
            label: "About Blurbs",
            type: "object",
            list: true,
            fields: [
              {
                name: "highlightedBlurb1",
                label: "Highlighted Text Blurb 1",
                type: "string"
              },
              {
                name: "blurb1",
                label: "Blurb 1",
                type: "string"
              },
              {
                name: "highlightedBlurb2",
                label: "Highlighted Text Blurb 2",
                type: "string"
              },
              {
                name: "blurb2",
                label: "Blurb 2",
                type: "string"
              },
              {
                name: "blurbImage",
                label: "Blurb Image",
                type: "image"
              }
            ]
          },
          {
            name: "aboutCTAText",
            label: "Call to Action Button Text",
            type: "string",
          },
          {
            name: "aboutCTALink",
            label: "Call to Action Button Link",
            type: "string"
          }
        ]
      },
      {
        name: "photos",
        label: "Photos Section",
        path: "_data/photos",
        format: "yaml",
        fields: [
          {
            name: "photosSection",
            label: "Event",
            type: "object",
            list: true,
            fields: [
              {
                name: "name",
                label: "Event Name",
                type: "string"
              },
              {
                name: "images",
                label: "Images",
                type: "image",
                list: true
              }
            ]
          }
        ]
      },
      {
        name: "links",
        label: "Social Media and Streaming Platforms",
        path: "_data/links",
        format: "yaml",
        fields: [
          {
            name: "title",
            label: "Section Title",
            type: "string"
          },
          {
            name: "app",
            label: "App",
            type: "object",
            list: true,
            fields: [
              {
                name: "name",
                label: "Name",
                type: "string"
              },
              {
                name: "link",
                label: "link",
                type: "string"
              },
              {
                name: "icon",
                label: "Image",
                type: "image"
              }
            ]
          }
        ]
      },
    ],
  },
});
