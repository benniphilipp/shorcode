/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/linkinbio/linkinbio-view.js":
/*!***********************************************!*\
  !*** ./assets/js/linkinbio/linkinbio-view.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n\nclass LinkInBioView {\n    constructor(){\n        const dataUrl = document.querySelector('#LinkInBioDeatilePage');\n        if(dataUrl){\n            this.ajaxView(dataUrl)\n        }\n    }\n\n    ajaxView(dataUrl){\n        $.ajax({\n            url: dataUrl.value,\n            type: 'GET',\n            dataType: 'json',\n            success: function(data) {\n            console.log(data);\n\n            $('#descriptionPageValue').text(data.context_json.description);\n            $('#titelpageValue').text(data.context_json.title);\n\n            // Rendern der URL-Social-Profile\n            const urlSocialProfilesContainer = $('#urlSocialProfilesContainer');\n            urlSocialProfilesContainer.empty();\n\n            data.social_media_data.forEach((profile) => {\n                const profileElement = `\n                <li>\n                    <a href=\"${profile.url}\">\n                        <i class=\"fa-brands ${profile.platform}\"></i>\n                    </a>\n                </li>\n                `;\n                urlSocialProfilesContainer.append(profileElement);\n            });\n\n\n            // Rendern der Link-in-Bio-Links\n            const linkInBioLinksContainer = $('#linkInBioLinksContainer');\n            linkInBioLinksContainer.empty();\n            \n            data.links.forEach((link) => {\n                const linkElement = `\n                    <a class=\"link-page-btn link-btn-color\" href=\"${link.url_destination}\">${link.button_label}</a>\n                `;\n                linkInBioLinksContainer.append(linkElement);\n            });\n\n            //Image\n            const pageImage = document.querySelector('.page-image');\n            const newImageUrl = data.image[0].profile_image;\n            pageImage.src = newImageUrl;\n\n\n            const cssStyles  = data['settings_json_data'];\n\n            for (const className in cssStyles) {\n                const elementInfo = cssStyles[className];\n                const elements = document.getElementsByClassName(className);\n        \n                for (const element of elements) {\n                    const defaultStyles = elementInfo.default;\n                    for (const styleName in defaultStyles) {\n                        element.style[styleName] = defaultStyles[styleName];\n                    }\n        \n                    // Fügen Sie den Hover-Effekt hinzu\n                    element.addEventListener('mouseenter', () => {\n                        const hoverStyles = elementInfo.hover;\n                        if (hoverStyles) {\n                            for (const styleName in hoverStyles) {\n                                element.style[styleName] = hoverStyles[styleName];\n                            }\n                        }\n                    });\n        \n                    // Entfernen Sie den Hover-Effekt\n                    element.addEventListener('mouseleave', () => {\n                        for (const styleName in defaultStyles) {\n                            element.style[styleName] = defaultStyles[styleName];\n                        }\n                    });\n                }\n            }\n\n\n            },\n            error: function(error) {\n              console.error('Fehler beim Abrufen der Daten: ' + error);\n            }\n        });\n    }\n\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LinkInBioView);\n\nconst linkinbioview = new LinkInBioView();\n\n//# sourceURL=webpack://src/./assets/js/linkinbio/linkinbio-view.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./assets/js/linkinbio/linkinbio-view.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;