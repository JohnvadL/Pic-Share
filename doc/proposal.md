# CSCC09 Web Project Proposal
## Picshare: Real Time Image Editing and Drawing

### Team Members
The team members for this web project are Arda Turkvan and John Vadayattukunnel Lal.

### Application Description
The plan for our application is to make a fully collaborative image editing and drawing tool, similar in functionality to existing desktop-based software like Adobe Photoshop. We want users to be able to, in real time, jointly put together a visual document that’s less of a whiteboard sketch and instead something a little more high-quality, being able to apply edits to imported images. It would include other features outside of image editing as well, such as drawing tools with different shapes and sizes and handwriting for easy diagram drawing, just to name a few. We also want it to be easy for new users to jump in, so collaborators can simply share a link and get started together. Users can also leave comments on sections of the image / document, and message each other in real-time through the in browser app for easier collaboration.
### Features that will be completed by the Beta version
Our goal for the Beta version is to have all of the key functionality implemented. This means that it will have:

1.   User authentication
		- Including joining editing session through a shareable link
2.  Importing images to the canvas via a file upload or copy/paste via clipboard
3. Real-Time Updating 
	- Base image editing features (Scale up, scale down, move, rotate, crop, etc)
	- Drawing with a simple drawing tool
4. Export Current Work
5. Save current session and be able to return to it later 

### Features that will be completed by the Final version
Our goal for the Final version is to have all extra niceties implemented. This means that it will have everything from the Beta version, and also:
1.   Users can comment on portions of the document for others to see
2.   Real-time chat between users
3.   Work layers for each user (i.e. user 1 can draw on their own layer separate from user 2; both are visible, but neither intrude on the other’s work)
4.  Computer vision pen stroke recognition to recognize diagrams and handwriting (using MyScript)
5.   Customizable drawing tool options (head shape, size, color, etc)
6.   Additional image editing options (filters, color correction i.e. HSV, Contrast, blurring)
		- Filters ( Some preset color options + Edge  )  
		- Color Correction ie. HSV
		- Contrast
		- Blurring
		- Sharpening
		- Edge Highlighting 
### Technologies we’ll use

We want to use a variety of tools and APIs to make our software look and function the best that it possibly can. For the front-end side, we plan to use React, and for the back-end we plan to use **GraphQL**. To make the UI look smooth and sleek, we plan to use an API called **Anime.js**. For web RTC (Real Time Communication), we plan to use **PeerJS** for all aspects of the real-time interaction within our software (chatting, commenting, drawing, editing). We also would like to use Computer Vision technology such as **MyScript** and **Opencv.js** to aid in pen stroke recognition and image processing. We would also like to use **MongoDB** to  store our data.

### Top 5 Technical Challenges
- Learning how to use the new front-end and back-end technologies we’re planning to use, React and GraphQL, since we don’t have any experience with them.
- Navigating and understanding how real-time communication happens between browser sessions, using an API like PeerJS
- Figuring out a good collaborative workflow
- Understanding how to deploy a server with a database
- Learning how to design systems that minimize server workload to ensure app performance with high numbers of concurrent users.
