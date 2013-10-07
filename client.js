/* Netention Client Configuration */

var configuration = {
    ui: 'ui.mobile.js',
    initialView: 'list', //TODO null = use last known view
    initialDisplayAvatarMenu: false,
    enableAnonymous: true,
    defaultAvatarIcon: '/icon/netention-160.jpg',
    includeCanNeedNot: true,
    wikiStartPage: 'Life', //'Portal:Contents',
    showPlanOnSelfPage: true,
    defaultTheme: '_cybernetic',
	requireIdentity: false,
	maxStartupObjects: 8192,
	defaultMapMode2D: true //true=2d, false=3d
};

//all hardcoded stuff here is temporary until icons are specified by ontology
var defaultIcons = { 
    'default': '/icon/rrze/status/true.png',
    'Earthquake': '/icon/quake.png',
    'NuclearFacility': '/icon/nuclear.png',
    'Human': '/icon/rrze/emblems/crown.png',
    'User': '/icon/rrze/emblems/ID-clip.png',
    'Message': '/icon/rrze/emblems/at.png',
    'Decision.Agree': '/icon/loomio/agree.png',
    'Decision.Disagree': '/icon/loomio/disagree.png',
    'Decision.Block': '/icon/loomio/block.png',
    'Decision.Abstain': '/icon/loomio/abstain.png',
    'Event': '/icon/rrze/actions/dial-in.png',
    'Report': '/icon/rrze/actions/add.png',
    'Similar': '/icon/approx_equal.png',
    'emotion.happy': '/icon/emoticon/happy.svg',
    'emotion.sad': '/icon/emoticon/sad.svg',
    'emotion.angry': '/icon/emoticon/angry.svg',
    'emotion.surprised': '/icon/emoticon/surprised.svg',
    'Tweet': '/icon/twitter.png',
    'PlanCentroid': '/icon/rrze/emblems/workflow-cycle.png',
	'Item': '/icon/rrze/emblems/database.png',
	'Volunteer': '/icon/sparkrelief/cat-volunteer-28.png',
	'Shelter': '/icon/sparkrelief/cat-shelter-28.png',
	'Food':  '/icon/sparkrelief/cat-food-28.png',
	'Tools':  '/icon/sparkrelief/cat-goods-28.png',
	'Health':  '/icon/sparkrelief/cat-medical-28.png',
	'Transport':  '/icon/sparkrelief/cat-transportation-28.png',
	'Service':  '/icon/sparkrelief/cat-services-28.png',
	'Animal':  '/icon/sparkrelief/cat-pets-28.png'
};

/* http://www.perbang.dk/rgbgradient/ 6 steps between: AFE500 and FF3B2E:   AFE500 E9EA08 EFBB11 F48E1A F96324 FF3B2E */
var tagColorPresets = {
    'BeginnerStudent': '#AFE500',
    'IntermediateStudent': '#E9EA08',
    'CollaboratingStudent': '#EFBB11',
    'CollaboratingTeacher': '#F48E1A',
    'IntermediateTeacher': '#F96324',
    'ExpertTeacher': '#FF3B2E',
    'Can': 'fuchsia',
    'Need': '#bbf',
    'Not': 'gray'
};

var tagAlias = {
    'BeginnerStudent': '-3σ',
    'IntermediateStudent': '-2σ',
    'CollaboratingStudent': '-1σ',
    'CollaboratingTeacher': '+1σ',
    'IntermediateTeacher': '+2σ',
    'ExpertTeacher': '+3σ'
};

//var tagAlias = {
//    'BeginnerStudent': 'α',
//    'IntermediateStudent': 'β',
//    'CollaboratingStudent': 'γ',
//    'CollaboratingTeacher': 'δ',
//    'IntermediateTeacher': 'ε',
//    'ExpertTeacher': 'ζ'
//};
