# Esports Tournament Web App

> Note. All The File Contains Any Firebase Keys Are Obsolete(Make Sure To Change That). Project has been migrated to another firebase app.

## technology used

- next.js
- tailwind css
- firebase auth
- firebase firestore

## Features

- authentication
- clan features
  - create clan
  - delete clan
  - join clan
  - kick someone from clan
- joining tournament option
- personal profile with portfolio
- completely secure by security rules

## how to setup project

> git cli , node.js is must to setup for this setup

### download project files

```sh
git clone https://github.com/Shreyansh-Sheth/esports.git
```

### install all dependencies

run this command is project directory

```sh
npm install
```

OR

```sh
yarn
```

### setup firebase for this project

1. follow this steps https://firebase.google.com/docs/web/setup
2. create new file in config folder
3. put given code into new file
   ```js
   const firebaseConfig = {
     apiKey: "API_KEY",
     authDomain: "PROJECT_ID.firebaseapp.com",
     databaseURL: "https://PROJECT_ID.firebaseio.com",
     projectId: "PROJECT_ID",
     storageBucket: "PROJECT_ID.appspot.com",
     messagingSenderId: "SENDER_ID",
     appId: "APP_ID",
     measurementId: "G-MEASUREMENT_ID",
   };
   export default firebaseConfig;
   ```
4. now run project
   ```sh
   npm run dev
   ```
   > some features needs you to have custom claim like {'role':'admin'}

## todo for this project

- [x] Design language setup
- [x] Auth
- [x] Clan Create
- [x] Clan Delete
- [x] Clan Join
- [x] Clan Kick
- [x] Tournament Related Notifications For Clan
- [x] Clan View
  - [x] Add Tournament Where this clan participated
- [x] Tournament view
- [x] Tournament Add
- [x] Tournament Delete
- [x] Tournament Join
  - [x] For Solo
  - [x] For Clan
- [x] Profile view
  - [x] Add All Tournamet That You Participated
- [ ] Tournament Related Notifications (Only For Solo Tournament)
- [x] Awsome homepage
- [x] Support Page
- [x] About Page

## Admin

- [x] Able To Add Matches
- [x] Change Scoreboard And Add Matchs As Tournament Goes
- [x] Enter Last Scoreboard (After Tournament Ends)

## Todo (Changes)

- [x] ui changes to /clan
- [x] able to change password of clan
- [x] change rules for one clan policy
- [x] Change "Please Confirm Your Password Color"
- [x] On Register Show Modal For Confirming Terms and rules for tournament
- [x] Hide Register Button ( When Participated )
- [x] Viewer For Tournament To See Who is Participated
- [x] Show Tournament Participated To User
- [x] Add Modal For Register
- [x] Ability To Add Clan To Tournament (Front End)
- [x] Ability To Add Clan To Tournament (Backend End)
- [x] Make Clan Data fOR tournament (For Participation Tab)
- [x] Change Ui For Clan
- [x] Changing Tournament Views Based On state of tournament
- [x] Ability To Change Password
- [x] Create Matches Based On Players And Show On Match View
- [x] Ability To Add Score Board After Match
- [x] Add Terms And Conditions For Main Page
- [x] Add Terms And Conditions For Clan Join Page
- [ ] Do Something About Firebase Backup (Firebase Backup Is Provided In Blaze Plan so after test think bout buy blaze)
- [ ] Add Some Error Handling On Place
- [x] Add Optimization
- [x] Home Page Art
- [x] Add About Page
- [x] Add Support page
- [x] Make Page For Organize Event At Your Place Campus
- [x] Make Page Inviting Sponsor And Other Content Creators

### Problems With Current Setup

> some issues are stated below

- [ ] ability to delete old stuffs from tournament and users
- [x] ability to send Room Codes Easily (solved)
- [x] ability to get user data properly (solved)

### Known Bugs

- [x] ended tournament shows register buttons
- [x] save button from the tournament
- [x] clan primary game selector selects destiny 2
- [x] show terms and conditions modal to user
- [x] support page for games
- [x] add analytics
- [x] write terms and conditions
- [x] register modal does not show properly on mobile devices
- [x] navlinks text make un selectable
- [x] use memo on support and rules link

## Future Things

- [ ] Brackets
- [ ] Auto Tournaments
- [ ] Email For Notifications

## Scalablity (issue Facing with Scalablity vs Read Counts) and solution

1. user data / clan data might be full of all the past tournament data (Remove after 50)
2. also notifications that they did not want (More Than Month Ago) (Remove After 20)
3. old tournament data that are on ended section that remove from index (But Keep Document)(Remove After 25 from ended only)

> there is a neat solution about all of this problems stated above that what we can do is create sub collection and store all data there but if you are using this product extensively these problems arise after 1-2 years because there is no way you can do more than 50 tournament a year.

## Rules (If You Want To Organize😀 Tournament These Are Rules)

- Player Can Be On Multiple Clans And That Clans Participated To diffrent tournaments but it is players responsiblity to manage time for diffrent tournament
- player cannot have multiple account (if you happen to have multiple account you should send us mail regarding that information)
- In tournament for multiple players clan leader can take responsiblity and accept all the ruling and terms for given tournament behalf of all clan members.
- On registration Time All Players Has To Have Their GamerTag set And Not Be changed until tournament is over
- player should not be able to change gaming account during tournament
- if some player has change their gamertag during tournament then player will be ban from that tournament
- if your team member has to leave during tournament you can forfit tournament by contacting us or you can continue tournament without that player but swaping players during tournamet is prohabited
