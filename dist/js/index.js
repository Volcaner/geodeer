/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "b108efe628a0029a710b"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(74)(__webpack_require__.s = 74);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var Vue // late bind
var version
var map = (window.__VUE_HOT_MAP__ = Object.create(null))
var installed = false
var isBrowserify = false
var initHookName = 'beforeCreate'

exports.install = function (vue, browserify) {
  if (installed) { return }
  installed = true

  Vue = vue.__esModule ? vue.default : vue
  version = Vue.version.split('.').map(Number)
  isBrowserify = browserify

  // compat with < 2.0.0-alpha.7
  if (Vue.config._lifecycleHooks.indexOf('init') > -1) {
    initHookName = 'init'
  }

  exports.compatible = version[0] >= 2
  if (!exports.compatible) {
    console.warn(
      '[HMR] You are using a version of vue-hot-reload-api that is ' +
        'only compatible with Vue.js core ^2.0.0.'
    )
    return
  }
}

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  if(map[id]) { return }
  
  var Ctor = null
  if (typeof options === 'function') {
    Ctor = options
    options = Ctor.options
  }
  makeOptionsHot(id, options)
  map[id] = {
    Ctor: Ctor,
    options: options,
    instances: []
  }
}

/**
 * Check if module is recorded
 *
 * @param {String} id
 */

exports.isRecorded = function (id) {
  return typeof map[id] !== 'undefined'
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot(id, options) {
  if (options.functional) {
    var render = options.render
    options.render = function (h, ctx) {
      var instances = map[id].instances
      if (ctx && instances.indexOf(ctx.parent) < 0) {
        instances.push(ctx.parent)
      }
      return render(h, ctx)
    }
  } else {
    injectHook(options, initHookName, function() {
      var record = map[id]
      if (!record.Ctor) {
        record.Ctor = this.constructor
      }
      record.instances.push(this)
    })
    injectHook(options, 'beforeDestroy', function() {
      var instances = map[id].instances
      instances.splice(instances.indexOf(this), 1)
    })
  }
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook(options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing) ? existing.concat(hook) : [existing, hook]
    : [hook]
}

function tryWrap(fn) {
  return function (id, arg) {
    try {
      fn(id, arg)
    } catch (e) {
      console.error(e)
      console.warn(
        'Something went wrong during Vue component hot-reload. Full reload required.'
      )
    }
  }
}

function updateOptions (oldOptions, newOptions) {
  for (var key in oldOptions) {
    if (!(key in newOptions)) {
      delete oldOptions[key]
    }
  }
  for (var key$1 in newOptions) {
    oldOptions[key$1] = newOptions[key$1]
  }
}

exports.rerender = tryWrap(function (id, options) {
  var record = map[id]
  if (!options) {
    record.instances.slice().forEach(function (instance) {
      instance.$forceUpdate()
    })
    return
  }
  if (typeof options === 'function') {
    options = options.options
  }
  if (record.Ctor) {
    record.Ctor.options.render = options.render
    record.Ctor.options.staticRenderFns = options.staticRenderFns
    record.instances.slice().forEach(function (instance) {
      instance.$options.render = options.render
      instance.$options.staticRenderFns = options.staticRenderFns
      // reset static trees
      // pre 2.5, all static trees are cahced together on the instance
      if (instance._staticTrees) {
        instance._staticTrees = []
      }
      // 2.5.0
      if (Array.isArray(record.Ctor.options.cached)) {
        record.Ctor.options.cached = []
      }
      // 2.5.3
      if (Array.isArray(instance.$options.cached)) {
        instance.$options.cached = []
      }
      // post 2.5.4: v-once trees are cached on instance._staticTrees.
      // Pure static trees are cached on the staticRenderFns array
      // (both already reset above)
      instance.$forceUpdate()
    })
  } else {
    // functional or no instance created yet
    record.options.render = options.render
    record.options.staticRenderFns = options.staticRenderFns

    // handle functional component re-render
    if (record.options.functional) {
      // rerender with full options
      if (Object.keys(options).length > 2) {
        updateOptions(record.options, options)
      } else {
        // template-only rerender.
        // need to inject the style injection code for CSS modules
        // to work properly.
        var injectStyles = record.options._injectStyles
        if (injectStyles) {
          var render = options.render
          record.options.render = function (h, ctx) {
            injectStyles.call(ctx)
            return render(h, ctx)
          }
        }
      }
      record.options._Ctor = null
      // 2.5.3
      if (Array.isArray(record.options.cached)) {
        record.options.cached = []
      }
      record.instances.slice().forEach(function (instance) {
        instance.$forceUpdate()
      })
    }
  }
})

exports.reload = tryWrap(function (id, options) {
  var record = map[id]
  if (options) {
    if (typeof options === 'function') {
      options = options.options
    }
    makeOptionsHot(id, options)
    if (record.Ctor) {
      if (version[1] < 2) {
        // preserve pre 2.2 behavior for global mixin handling
        record.Ctor.extendOptions = options
      }
      var newCtor = record.Ctor.super.extend(options)
      record.Ctor.options = newCtor.options
      record.Ctor.cid = newCtor.cid
      record.Ctor.prototype = newCtor.prototype
      if (newCtor.release) {
        // temporary global mixin strategy used in < 2.0.0-alpha.6
        newCtor.release()
      }
    } else {
      updateOptions(record.options, options)
    }
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$vnode && instance.$vnode.context) {
      instance.$vnode.context.$forceUpdate()
    } else {
      console.warn(
        'Root or manually mounted instance modified. Full reload required.'
      )
    }
  })
})


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/*!
 * Vue.js v2.0.8
 * (c) 2014-2016 Evan You
 * Released under the MIT License.
 */


/*  */

/**
 * Convert a value to a string that is actually rendered.
 */
function _toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val, 10);
  return (n || n === 0) ? n : val
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Remove an item from an array
 */
function remove$1 (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  }
}

/**
 * Camelize a hyphen-delmited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /([^-])([A-Z])/g;
var hyphenate = cached(function (str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind$1 (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';
function isPlainObject (obj) {
  return toString.call(obj) === OBJECT_STRING
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 */
function noop () {}

/**
 * Always return false.
 */
var no = function () { return false; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  /* eslint-disable eqeqeq */
  return a == b || (
    isObject(a) && isObject(b)
      ? JSON.stringify(a) === JSON.stringify(b)
      : false
  )
  /* eslint-enable eqeqeq */
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/*  */

var config = {
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Whether to enable devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: null,

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * List of asset types that a component can own.
   */
  _assetTypes: [
    'component',
    'directive',
    'filter'
  ],

  /**
   * List of lifecycle hooks.
   */
  _lifecycleHooks: [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated'
  ],

  /**
   * Max circular updates allowed in a scheduler flush cycle.
   */
  _maxUpdateCount: 100,

  /**
   * Server rendering?
   */
  _isServer: process.env.VUE_ENV === 'server'
};

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  } else {
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) { return }
        obj = obj[segments[i]];
      }
      return obj
    }
  }
}

/*  */
/* globals MutationObserver */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser =
  typeof window !== 'undefined' &&
  Object.prototype.toString.call(window) !== '[object Object]';

var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return /native code/.test(Ctor.toString())
}

/**
 * Defer a task to execute it asynchronously.
 */
var nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(nextTickHandler);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
  } else if (typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick (cb, ctx) {
    var func = ctx
      ? function () { cb.call(ctx); }
      : cb;
    callbacks.push(func);
    if (!pending) {
      pending = true;
      timerFunc();
    }
  }
})();

var _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] !== undefined
    };
    Set.prototype.add = function add (key) {
      this.set[key] = 1;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/* not type checking this file because flow doesn't play well with Proxy */

var hasProxy;
var proxyHandlers;
var initProxy;

if (process.env.NODE_ENV !== 'production') {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  proxyHandlers = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warn(
          "Property or method \"" + key + "\" is not defined on the instance but " +
          "referenced during render. Make sure to declare reactive data " +
          "properties in the data option.",
          target
        );
      }
      return has || !isAllowed
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      vm._renderProxy = new Proxy(vm, proxyHandlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */


var uid$2 = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid$2++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove$1(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stablize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */


var queue = [];
var has$1 = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  queue.length = 0;
  has$1 = {};
  if (process.env.NODE_ENV !== 'production') {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    var watcher = queue[index];
    var id = watcher.id;
    has$1[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has$1[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > config._maxUpdateCount) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }

  resetSchedulerState();
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has$1[id] == null) {
    has$1[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i >= 0 && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(Math.max(i, index) + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$1 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  if ( options === void 0 ) options = {};

  this.vm = vm;
  vm._watchers.push(this);
  // options
  this.deep = !!options.deep;
  this.user = !!options.user;
  this.lazy = !!options.lazy;
  this.sync = !!options.sync;
  this.expression = expOrFn.toString();
  this.cb = cb;
  this.id = ++uid$1; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      process.env.NODE_ENV !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value = this.getter.call(this.vm, this.vm);
  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  if (this.deep) {
    traverse(value);
  }
  popTarget();
  this.cleanupDeps();
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
      if (
        value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          process.env.NODE_ENV !== 'production' && warn(
            ("Error in watcher \"" + (this.expression) + "\""),
            this.vm
          );
          /* istanbul ignore else */
          if (config.errorHandler) {
            config.errorHandler.call(null, e, this.vm);
          } else {
            throw e
          }
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed or is performing a v-for
    // re-render (the watcher list is then filtered by v-for).
    if (!this.vm._isBeingDestroyed && !this.vm._vForRemoving) {
      remove$1(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set();
function traverse (val) {
  seenObjects.clear();
  _traverse(val, seenObjects);
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var arguments$1 = arguments;

    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length;
    var args = new Array(i);
    while (i--) {
      args[i] = arguments$1[i];
    }
    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
        inserted = args;
        break
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true,
  isSettingProps: false
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 *
 * istanbul ignore next
 */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value) {
  if (!isObject(value)) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !config._isServer &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (obj, key, val) {
  if (Array.isArray(obj)) {
    obj.length = Math.max(obj.length, key);
    obj.splice(key, 1, val);
    return val
  }
  if (hasOwn(obj, key)) {
    obj[key] = val;
    return
  }
  var ob = obj.__ob__;
  if (obj._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return
  }
  if (!ob) {
    obj[key] = val;
    return
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (obj, key) {
  var ob = obj.__ob__;
  if (obj._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(obj, key)) {
    return
  }
  delete obj[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

function initState (vm) {
  vm._watchers = [];
  initProps(vm);
  initData(vm);
  initComputed(vm);
  initMethods(vm);
  initWatch(vm);
}

var isReservedProp = makeMap('key,ref,slot');

function initProps (vm) {
  var props = vm.$options.props;
  if (props) {
    var propsData = vm.$options.propsData || {};
    var keys = vm.$options._propKeys = Object.keys(props);
    var isRoot = !vm.$parent;
    // root instance props should be converted
    observerState.shouldConvert = isRoot;
    var loop = function ( i ) {
      var key = keys[i];
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        if (isReservedProp(key)) {
          warn(
            ("\"" + key + "\" is a reserved attribute and cannot be used as component prop."),
            vm
          );
        }
        defineReactive$$1(vm, key, validateProp(key, props, propsData, vm), function () {
          if (vm.$parent && !observerState.isSettingProps) {
            warn(
              "Avoid mutating a prop directly since the value will be " +
              "overwritten whenever the parent component re-renders. " +
              "Instead, use a data or computed property based on the prop's " +
              "value. Prop being mutated: \"" + key + "\"",
              vm
            );
          }
        });
      } else {
        defineReactive$$1(vm, key, validateProp(key, props, propsData, vm));
      }
    };

    for (var i = 0; i < keys.length; i++) loop( i );
    observerState.shouldConvert = true;
  }
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? data.call(vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object.',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var i = keys.length;
  while (i--) {
    if (props && hasOwn(props, keys[i])) {
      process.env.NODE_ENV !== 'production' && warn(
        "The data property \"" + (keys[i]) + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else {
      proxy(vm, keys[i]);
    }
  }
  // observe data
  observe(data);
  data.__ob__ && data.__ob__.vmCount++;
}

var computedSharedDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function initComputed (vm) {
  var computed = vm.$options.computed;
  if (computed) {
    for (var key in computed) {
      var userDef = computed[key];
      if (typeof userDef === 'function') {
        computedSharedDefinition.get = makeComputedGetter(userDef, vm);
        computedSharedDefinition.set = noop;
      } else {
        computedSharedDefinition.get = userDef.get
          ? userDef.cache !== false
            ? makeComputedGetter(userDef.get, vm)
            : bind$1(userDef.get, vm)
          : noop;
        computedSharedDefinition.set = userDef.set
          ? bind$1(userDef.set, vm)
          : noop;
      }
      Object.defineProperty(vm, key, computedSharedDefinition);
    }
  }
}

function makeComputedGetter (getter, owner) {
  var watcher = new Watcher(owner, getter, noop, {
    lazy: true
  });
  return function computedGetter () {
    if (watcher.dirty) {
      watcher.evaluate();
    }
    if (Dep.target) {
      watcher.depend();
    }
    return watcher.value
  }
}

function initMethods (vm) {
  var methods = vm.$options.methods;
  if (methods) {
    for (var key in methods) {
      vm[key] = methods[key] == null ? noop : bind$1(methods[key], vm);
      if (process.env.NODE_ENV !== 'production' && methods[key] == null) {
        warn(
          "method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
    }
  }
}

function initWatch (vm) {
  var watch = vm.$options.watch;
  if (watch) {
    for (var key in watch) {
      var handler = watch[key];
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }
}

function createWatcher (vm, key, handler) {
  var options;
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  vm.$watch(key, handler, options);
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () {
    return this._data
  };
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

function proxy (vm, key) {
  if (!isReserved(key)) {
    Object.defineProperty(vm, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter () {
        return vm._data[key]
      },
      set: function proxySetter (val) {
        vm._data[key] = val;
      }
    });
  }
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  ns,
  context,
  componentOptions
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = ns;
  this.context = context;
  this.functionalContext = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.child = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
};

var emptyVNode = function () {
  var node = new VNode();
  node.text = '';
  node.isComment = true;
  return node
};

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.ns,
    vnode.context,
    vnode.componentOptions
  );
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isCloned = true;
  return cloned
}

function cloneVNodes (vnodes) {
  var res = new Array(vnodes.length);
  for (var i = 0; i < vnodes.length; i++) {
    res[i] = cloneVNode(vnodes[i]);
  }
  return res
}

/*  */

function mergeVNodeHook (def, hookKey, hook, key) {
  key = key + hookKey;
  var injectedHash = def.__injected || (def.__injected = {});
  if (!injectedHash[key]) {
    injectedHash[key] = true;
    var oldHook = def[hookKey];
    if (oldHook) {
      def[hookKey] = function () {
        oldHook.apply(this, arguments);
        hook.apply(this, arguments);
      };
    } else {
      def[hookKey] = hook;
    }
  }
}

/*  */

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, fn, event, capture;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    if (!cur) {
      process.env.NODE_ENV !== 'production' && warn(
        "Invalid handler for event \"" + name + "\": got " + String(cur),
        vm
      );
    } else if (!old) {
      capture = name.charAt(0) === '!';
      event = capture ? name.slice(1) : name;
      if (Array.isArray(cur)) {
        add(event, (cur.invoker = arrInvoker(cur)), capture);
      } else {
        if (!cur.invoker) {
          fn = cur;
          cur = on[name] = {};
          cur.fn = fn;
          cur.invoker = fnInvoker(cur);
        }
        add(event, cur.invoker, capture);
      }
    } else if (cur !== old) {
      if (Array.isArray(old)) {
        old.length = cur.length;
        for (var i = 0; i < old.length; i++) { old[i] = cur[i]; }
        on[name] = old;
      } else {
        old.fn = cur;
        on[name] = old;
      }
    }
  }
  for (name in oldOn) {
    if (!on[name]) {
      event = name.charAt(0) === '!' ? name.slice(1) : name;
      remove$$1(event, oldOn[name].invoker);
    }
  }
}

function arrInvoker (arr) {
  return function (ev) {
    var arguments$1 = arguments;

    var single = arguments.length === 1;
    for (var i = 0; i < arr.length; i++) {
      single ? arr[i](ev) : arr[i].apply(null, arguments$1);
    }
  }
}

function fnInvoker (o) {
  return function (ev) {
    var single = arguments.length === 1;
    single ? o.fn(ev) : o.fn.apply(null, arguments);
  }
}

/*  */

function normalizeChildren (
  children,
  ns,
  nestedIndex
) {
  if (isPrimitive(children)) {
    return [createTextVNode(children)]
  }
  if (Array.isArray(children)) {
    var res = [];
    for (var i = 0, l = children.length; i < l; i++) {
      var c = children[i];
      var last = res[res.length - 1];
      //  nested
      if (Array.isArray(c)) {
        res.push.apply(res, normalizeChildren(c, ns, ((nestedIndex || '') + "_" + i)));
      } else if (isPrimitive(c)) {
        if (last && last.text) {
          last.text += String(c);
        } else if (c !== '') {
          // convert primitive to vnode
          res.push(createTextVNode(c));
        }
      } else if (c instanceof VNode) {
        if (c.text && last && last.text) {
          if (!last.isCloned) {
            last.text += c.text;
          }
        } else {
          // inherit parent namespace
          if (ns) {
            applyNS(c, ns);
          }
          // default key for nested array children (likely generated by v-for)
          if (c.tag && c.key == null && nestedIndex != null) {
            c.key = "__vlist" + nestedIndex + "_" + i + "__";
          }
          res.push(c);
        }
      }
    }
    return res
  }
}

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

function applyNS (vnode, ns) {
  if (vnode.tag && !vnode.ns) {
    vnode.ns = ns;
    if (vnode.children) {
      for (var i = 0, l = vnode.children.length; i < l; i++) {
        applyNS(vnode.children[i], ns);
      }
    }
  }
}

/*  */

function getFirstComponentChild (children) {
  return children && children.filter(function (c) { return c && c.componentOptions; })[0]
}

/*  */

var activeInstance = null;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._mount = function (
    el,
    hydrating
  ) {
    var vm = this;
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = emptyVNode;
      if (process.env.NODE_ENV !== 'production') {
        /* istanbul ignore if */
        if (vm.$options.template && vm.$options.template.charAt(0) !== '#') {
          warn(
            'You are using the runtime-only build of Vue where the template ' +
            'option is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.',
            vm
          );
        } else {
          warn(
            'Failed to mount component: template or render function not defined.',
            vm
          );
        }
      }
    }
    callHook(vm, 'beforeMount');
    vm._watcher = new Watcher(vm, function () {
      vm._update(vm._render(), hydrating);
    }, noop);
    hydrating = false;
    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm
  };

  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    var prevVnode = vm._vnode;
    vm._vnode = vnode;
    if (!prevVnode) {
      // Vue.prototype.__patch__ is injected in entry points
      // based on the rendering backend used.
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating);
    } else {
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    if (vm._isMounted) {
      callHook(vm, 'updated');
    }
  };

  Vue.prototype._updateFromParent = function (
    propsData,
    listeners,
    parentVnode,
    renderChildren
  ) {
    var vm = this;
    var hasChildren = !!(vm.$options._renderChildren || renderChildren);
    vm.$options._parentVnode = parentVnode;
    vm.$options._renderChildren = renderChildren;
    // update props
    if (propsData && vm.$options.props) {
      observerState.shouldConvert = false;
      if (process.env.NODE_ENV !== 'production') {
        observerState.isSettingProps = true;
      }
      var propKeys = vm.$options._propKeys || [];
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i];
        vm[key] = validateProp(key, vm.$options.props, propsData, vm);
      }
      observerState.shouldConvert = true;
      if (process.env.NODE_ENV !== 'production') {
        observerState.isSettingProps = false;
      }
      vm.$options.propsData = propsData;
    }
    // update listeners
    if (listeners) {
      var oldListeners = vm.$options._parentListeners;
      vm.$options._parentListeners = listeners;
      vm._updateListeners(listeners, oldListeners);
    }
    // resolve slots + force update if has children
    if (hasChildren) {
      vm.$slots = resolveSlots(renderChildren, vm._renderContext);
      vm.$forceUpdate();
    }
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove$1(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
  };
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      handlers[i].call(vm);
    }
  }
  vm.$emit('hook:' + hook);
}

/*  */

var hooks = { init: init, prepatch: prepatch, insert: insert, destroy: destroy$1 };
var hooksToMerge = Object.keys(hooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (!Ctor) {
    return
  }

  var baseCtor = context.$options._base;
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  if (!Ctor.cid) {
    if (Ctor.resolved) {
      Ctor = Ctor.resolved;
    } else {
      Ctor = resolveAsyncComponent(Ctor, baseCtor, function () {
        // it's ok to queue this on every render because
        // $forceUpdate is buffered by the scheduler.
        context.$forceUpdate();
      });
      if (!Ctor) {
        // return nothing if this is indeed an async component
        // wait for the callback to trigger parent update.
        return
      }
    }
  }

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  data = data || {};

  // extract props
  var propsData = extractProps(data, Ctor);

  // functional component
  if (Ctor.options.functional) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  data.on = data.nativeOn;

  if (Ctor.options.abstract) {
    // abstract components do not keep anything
    // other than props & listeners
    data = {};
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }
  );
  return vnode
}

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  context,
  children
) {
  var props = {};
  var propOptions = Ctor.options.props;
  if (propOptions) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData);
    }
  }
  var vnode = Ctor.options.render.call(
    null,
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    bind$1(createElement, { _self: Object.create(context) }),
    {
      props: props,
      data: data,
      parent: context,
      children: normalizeChildren(children),
      slots: function () { return resolveSlots(children, context); }
    }
  );
  if (vnode instanceof VNode) {
    vnode.functionalContext = context;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (inlineTemplate) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function init (vnode, hydrating) {
  if (!vnode.child || vnode.child._isDestroyed) {
    var child = vnode.child = createComponentInstanceForVnode(vnode, activeInstance);
    child.$mount(hydrating ? vnode.elm : undefined, hydrating);
  } else if (vnode.data.keepAlive) {
    // kept-alive components, treat as a patch
    var mountedNode = vnode; // work around flow
    prepatch(mountedNode, mountedNode);
  }
}

function prepatch (
  oldVnode,
  vnode
) {
  var options = vnode.componentOptions;
  var child = vnode.child = oldVnode.child;
  child._updateFromParent(
    options.propsData, // updated props
    options.listeners, // updated listeners
    vnode, // new parent vnode
    options.children // new children
  );
}

function insert (vnode) {
  if (!vnode.child._isMounted) {
    vnode.child._isMounted = true;
    callHook(vnode.child, 'mounted');
  }
  if (vnode.data.keepAlive) {
    vnode.child._inactive = false;
    callHook(vnode.child, 'activated');
  }
}

function destroy$1 (vnode) {
  if (!vnode.child._isDestroyed) {
    if (!vnode.data.keepAlive) {
      vnode.child.$destroy();
    } else {
      vnode.child._inactive = true;
      callHook(vnode.child, 'deactivated');
    }
  }
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  cb
) {
  if (factory.requested) {
    // pool callbacks
    factory.pendingCallbacks.push(cb);
  } else {
    factory.requested = true;
    var cbs = factory.pendingCallbacks = [cb];
    var sync = true;

    var resolve = function (res) {
      if (isObject(res)) {
        res = baseCtor.extend(res);
      }
      // cache resolved
      factory.resolved = res;
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        for (var i = 0, l = cbs.length; i < l; i++) {
          cbs[i](res);
        }
      }
    };

    var reject = function (reason) {
      process.env.NODE_ENV !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
    };

    var res = factory(resolve, reject);

    // handle promise
    if (res && typeof res.then === 'function' && !factory.resolved) {
      res.then(resolve, reject);
    }

    sync = false;
    // return in case resolved synchronously
    return factory.resolved
  }
}

function extractProps (data, Ctor) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (!propOptions) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  var domProps = data.domProps;
  if (attrs || props || domProps) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey) ||
      checkProp(res, domProps, key, altKey);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (hash) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = hooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (a, b) {
  // since all hooks have at most two args, use fixed args
  // to avoid having to use fn.apply().
  return function (_, __) {
    a(_, __);
    b(_, __);
  }
}

/*  */

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  tag,
  data,
  children
) {
  if (data && (Array.isArray(data) || typeof data !== 'object')) {
    children = data;
    data = undefined;
  }
  // make sure to use real instance instead of proxy as context
  return _createElement(this._self, tag, data, children)
}

function _createElement (
  context,
  tag,
  data,
  children
) {
  if (data && data.__ob__) {
    process.env.NODE_ENV !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return emptyVNode()
  }
  if (typeof tag === 'string') {
    var Ctor;
    var ns = config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      return new VNode(
        tag, data, normalizeChildren(children, ns),
        undefined, undefined, ns, context
      )
    } else if ((Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      return createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      var childNs = tag === 'foreignObject' ? 'xhtml' : ns;
      return new VNode(
        tag, data, normalizeChildren(children, childNs),
        undefined, undefined, ns, context
      )
    }
  } else {
    // direct component options / constructor
    return createComponent(tag, data, context, children)
  }
}

/*  */

function initRender (vm) {
  vm.$vnode = null; // the placeholder node in parent tree
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null;
  vm._renderContext = vm.$options._parentVnode && vm.$options._parentVnode.context;
  vm.$slots = resolveSlots(vm.$options._renderChildren, vm._renderContext);
  // bind the public createElement fn to this instance
  // so that we get proper render context inside it.
  vm.$createElement = bind$1(createElement, vm);
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
}

function renderMixin (Vue) {
  Vue.prototype.$nextTick = function (fn) {
    nextTick(fn, this);
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var staticRenderFns = ref.staticRenderFns;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // clone slot nodes on re-renders
      for (var key in vm.$slots) {
        vm.$slots[key] = cloneVNodes(vm.$slots[key]);
      }
    }

    if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = [];
    }
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        warn(("Error when rendering " + (formatComponentName(vm)) + ":"));
      }
      /* istanbul ignore else */
      if (config.errorHandler) {
        config.errorHandler.call(null, e, vm);
      } else {
        if (config._isServer) {
          throw e
        } else {
          console.error(e);
        }
      }
      // return previous vnode to prevent render error causing blank component
      vnode = vm._vnode;
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = emptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };

  // shorthands used in render functions
  Vue.prototype._h = createElement;
  // toString for mustaches
  Vue.prototype._s = _toString;
  // number conversion
  Vue.prototype._n = toNumber;
  // empty vnode
  Vue.prototype._e = emptyVNode;
  // loose equal
  Vue.prototype._q = looseEqual;
  // loose indexOf
  Vue.prototype._i = looseIndexOf;

  // render static tree by index
  Vue.prototype._m = function renderStatic (
    index,
    isInFor
  ) {
    var tree = this._staticTrees[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree by doing a shallow clone.
    if (tree && !isInFor) {
      return Array.isArray(tree)
        ? cloneVNodes(tree)
        : cloneVNode(tree)
    }
    // otherwise, render a fresh tree.
    tree = this._staticTrees[index] = this.$options.staticRenderFns[index].call(this._renderProxy);
    markStatic(tree, ("__static__" + index), false);
    return tree
  };

  // mark node as static (v-once)
  Vue.prototype._o = function markOnce (
    tree,
    index,
    key
  ) {
    markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
    return tree
  };

  function markStatic (tree, key, isOnce) {
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i] && typeof tree[i] !== 'string') {
          markStaticNode(tree[i], (key + "_" + i), isOnce);
        }
      }
    } else {
      markStaticNode(tree, key, isOnce);
    }
  }

  function markStaticNode (node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
  }

  // filter resolution helper
  var identity = function (_) { return _; };
  Vue.prototype._f = function resolveFilter (id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity
  };

  // render v-for
  Vue.prototype._l = function renderList (
    val,
    render
  ) {
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
    return ret
  };

  // renderSlot
  Vue.prototype._t = function (
    name,
    fallback
  ) {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes && process.env.NODE_ENV !== 'production') {
      slotNodes._rendered && warn(
        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
        "- this will likely cause render errors.",
        this
      );
      slotNodes._rendered = true;
    }
    return slotNodes || fallback
  };

  // apply v-bind object
  Vue.prototype._b = function bindProps (
    data,
    tag,
    value,
    asProp
  ) {
    if (value) {
      if (!isObject(value)) {
        process.env.NODE_ENV !== 'production' && warn(
          'v-bind without argument expects an Object or Array value',
          this
        );
      } else {
        if (Array.isArray(value)) {
          value = toObject(value);
        }
        for (var key in value) {
          if (key === 'class' || key === 'style') {
            data[key] = value[key];
          } else {
            var hash = asProp || config.mustUseProp(tag, key)
              ? data.domProps || (data.domProps = {})
              : data.attrs || (data.attrs = {});
            hash[key] = value[key];
          }
        }
      }
    }
    return data
  };

  // expose v-on keyCodes
  Vue.prototype._k = function getKeyCodes (key) {
    return config.keyCodes[key]
  };
}

function resolveSlots (
  renderChildren,
  context
) {
  var slots = {};
  if (!renderChildren) {
    return slots
  }
  var children = normalizeChildren(renderChildren) || [];
  var defaultSlot = [];
  var name, child;
  for (var i = 0, l = children.length; i < l; i++) {
    child = children[i];
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) &&
        child.data && (name = child.data.slot)) {
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      defaultSlot.push(child);
    }
  }
  // ignore single whitespace
  if (defaultSlot.length && !(
    defaultSlot.length === 1 &&
    (defaultSlot[0].text === ' ' || defaultSlot[0].isComment)
  )) {
    slots.default = defaultSlot;
  }
  return slots
}

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  var on = bind$1(vm.$on, vm);
  var off = bind$1(vm.$off, vm);
  vm._updateListeners = function (listeners, oldListeners) {
    updateListeners(listeners, oldListeners || {}, on, off, vm);
  };
  if (listeners) {
    vm._updateListeners(listeners);
  }
}

function eventsMixin (Vue) {
  Vue.prototype.$on = function (event, fn) {
    var vm = this;(vm._events[event] || (vm._events[event] = [])).push(fn);
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (arguments.length === 1) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        cbs[i].apply(vm, args);
      }
    }
    return vm
  };
}

/*  */

var uid = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid++;
    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    callHook(vm, 'beforeCreate');
    initState(vm);
    callHook(vm, 'created');
    initRender(vm);
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = Ctor.super.options;
    var cachedSuperOptions = Ctor.superOptions;
    var extendOptions = Ctor.extendOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed
      Ctor.superOptions = superOptions;
      extendOptions.render = options.render;
      extendOptions.staticRenderFns = options.staticRenderFns;
      options = Ctor.options = mergeOptions(superOptions, extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function Vue$2 (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue$2)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$2);
stateMixin(Vue$2);
eventsMixin(Vue$2);
lifecycleMixin(Vue$2);
renderMixin(Vue$2);

var warn = noop;
var formatComponentName;

if (process.env.NODE_ENV !== 'production') {
  var hasConsole = typeof console !== 'undefined';

  warn = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.error("[Vue warn]: " + msg + " " + (
        vm ? formatLocation(formatComponentName(vm)) : ''
      ));
    }
  };

  formatComponentName = function (vm) {
    if (vm.$root === vm) {
      return 'root instance'
    }
    var name = vm._isVue
      ? vm.$options.name || vm.$options._componentTag
      : vm.name;
    return (
      (name ? ("component <" + name + ">") : "anonymous component") +
      (vm._isVue && vm.$options.__file ? (" at " + (vm.$options.__file)) : '')
    )
  };

  var formatLocation = function (str) {
    if (str === 'anonymous component') {
      str += " - use the \"name\" option for better debugging messages.";
    }
    return ("\n(found in " + str + ")")
  };
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        childVal.call(this),
        parentVal.call(this)
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
};

/**
 * Hooks and param attributes are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

config._lifecycleHooks.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal
    ? extend(res, childVal)
    : res
}

config._assetTypes.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  /* istanbul ignore if */
  if (!childVal) { return parentVal }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.computed = function (parentVal, childVal) {
  if (!childVal) { return parentVal }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  extend(ret, childVal);
  return ret
};

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + key
      );
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  }
  options.props = res;
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child);
  }
  normalizeProps(child);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = typeof extendsFrom === 'function'
      ? mergeOptions(parent, extendsFrom.options, vm)
      : mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      var mixin = child.mixins[i];
      if (mixin.prototype instanceof Vue$2) {
        mixin = mixin.options;
      }
      parent = mergeOptions(parent, mixin, vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  var res = assets[id] ||
    // camelCase ID
    assets[camelize(id)] ||
    // Pascal Case ID
    assets[capitalize(camelize(id))];
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isBooleanType(prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  if (process.env.NODE_ENV !== 'production') {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (isObject(def)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm[key] !== undefined) {
    return vm[key]
  }
  // call factory function for non-Function types
  return typeof def === 'function' && prop.type !== Function
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType);
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      'Invalid prop: type check failed for prop "' + name + '".' +
      ' Expected ' + expectedTypes.map(capitalize).join(', ') +
      ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

/**
 * Assert the type of a value
 */
function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (expectedType === 'String') {
    valid = typeof value === (expectedType = 'string');
  } else if (expectedType === 'Number') {
    valid = typeof value === (expectedType = 'number');
  } else if (expectedType === 'Boolean') {
    valid = typeof value === (expectedType = 'boolean');
  } else if (expectedType === 'Function') {
    valid = typeof value === (expectedType = 'function');
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match && match[1]
}

function isBooleanType (fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === 'Boolean'
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === 'Boolean') {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}



var util = Object.freeze({
	defineReactive: defineReactive$$1,
	_toString: _toString,
	toNumber: toNumber,
	makeMap: makeMap,
	isBuiltInTag: isBuiltInTag,
	remove: remove$1,
	hasOwn: hasOwn,
	isPrimitive: isPrimitive,
	cached: cached,
	camelize: camelize,
	capitalize: capitalize,
	hyphenate: hyphenate,
	bind: bind$1,
	toArray: toArray,
	extend: extend,
	isObject: isObject,
	isPlainObject: isPlainObject,
	toObject: toObject,
	noop: noop,
	no: no,
	genStaticKeys: genStaticKeys,
	looseEqual: looseEqual,
	looseIndexOf: looseIndexOf,
	isReserved: isReserved,
	def: def,
	parsePath: parsePath,
	hasProto: hasProto,
	inBrowser: inBrowser,
	UA: UA,
	isIE: isIE,
	isIE9: isIE9,
	isEdge: isEdge,
	isAndroid: isAndroid,
	isIOS: isIOS,
	devtools: devtools,
	nextTick: nextTick,
	get _Set () { return _Set; },
	mergeOptions: mergeOptions,
	resolveAsset: resolveAsset,
	get warn () { return warn; },
	get formatComponentName () { return formatComponentName; },
	validateProp: validateProp
});

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    /* istanbul ignore if */
    if (plugin.installed) {
      return
    }
    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else {
      plugin.apply(null, args);
    }
    plugin.installed = true;
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }
    var name = extendOptions.name || Super.options.name;
    if (process.env.NODE_ENV !== 'production') {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characaters and the hyphen.'
        );
      }
    }
    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;
    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;
    // create asset registers, so extended classes
    // can have their private assets too.
    config._assetTypes.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }
    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  config._assetTypes.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,
  created: function created () {
    this.cache = Object.create(null);
  },
  render: function render () {
    var vnode = getFirstComponentChild(this.$slots.default);
    if (vnode && vnode.componentOptions) {
      var opts = vnode.componentOptions;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? opts.Ctor.cid + '::' + opts.tag
        : vnode.key;
      if (this.cache[key]) {
        vnode.child = this.cache[key].child;
      } else {
        this.cache[key] = vnode;
      }
      vnode.data.keepAlive = true;
    }
    return vnode
  },
  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this.cache) {
      var vnode = this$1.cache[key];
      callHook(vnode.child, 'deactivated');
      vnode.child.$destroy();
    }
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);
  Vue.util = util;
  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  config._assetTypes.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$2);

Object.defineProperty(Vue$2.prototype, '$isServer', {
  get: function () { return config._isServer; }
});

Vue$2.version = '2.0.8';

/*  */

// attributes that should be using props for binding
var mustUseProp = function (tag, attr) {
  return (
    (attr === 'value' && (tag === 'input' || tag === 'textarea' || tag === 'option')) ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var isAttr = makeMap(
  'accept,accept-charset,accesskey,action,align,alt,async,autocomplete,' +
  'autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset,' +
  'checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv,' +
  'name,contenteditable,contextmenu,controls,coords,data,datetime,default,' +
  'defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for,' +
  'form,formaction,headers,<th>,height,hidden,high,href,hreflang,http-equiv,' +
  'icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,' +
  'manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file,' +
  'muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,' +
  'preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox,' +
  'scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span,' +
  'spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,' +
  'target,title,type,usemap,value,width,wrap'
);



var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (childNode.child) {
    childNode = childNode.child._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return genClassFromData(data)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: child.class
      ? [child.class, parent.class]
      : parent.class
  }
}

function genClassFromData (data) {
  var dynamicClass = data.class;
  var staticClass = data.staticClass;
  if (staticClass || dynamicClass) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  var res = '';
  if (!value) {
    return res
  }
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (value[i]) {
        if ((stringified = stringifyClass(value[i]))) {
          res += stringified + ' ';
        }
      }
    }
    return res.slice(0, -1)
  }
  if (isObject(value)) {
    for (var key in value) {
      if (value[key]) { res += key + ' '; }
    }
    return res.slice(0, -1)
  }
  /* istanbul ignore next */
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML',
  xhtml: 'http://www.w3.org/1999/xhtml'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template'
);

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr',
  true
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source',
  true
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track',
  true
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font,' +
  'font-face,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);



var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selector = el;
    el = document.querySelector(el);
    if (!el) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + selector
      );
      return document.createElement('div')
    }
  }
  return el
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  if (vnode.data && vnode.data.attrs && 'multiple' in vnode.data.attrs) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function childNodes (node) {
  return node.childNodes
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	childNodes: childNodes,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.child || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove$1(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (Array.isArray(refs[key]) && refs[key].indexOf(ref) < 0) {
        refs[key].push(ref);
      } else {
        refs[key] = [ref];
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *

/*
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks$1 = ['create', 'update', 'remove', 'destroy'];

function isUndef (s) {
  return s == null
}

function isDef (s) {
  return s != null
}

function sameVnode (vnode1, vnode2) {
  return (
    vnode1.key === vnode2.key &&
    vnode1.tag === vnode2.tag &&
    vnode1.isComment === vnode2.isComment &&
    !vnode1.data === !vnode2.data
  )
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks$1.length; ++i) {
    cbs[hooks$1[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (modules[j][hooks$1[i]] !== undefined) { cbs[hooks$1[i]].push(modules[j][hooks$1[i]]); }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeElement(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeElement (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html
    if (parent) {
      nodeOps.removeChild(parent, el);
    }
  }

  function createElm (vnode, insertedVnodeQueue, nested) {
    var i;
    var data = vnode.data;
    vnode.isRootInsert = !nested;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode); }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(i = vnode.child)) {
        initComponent(vnode, insertedVnodeQueue);
        return vnode.elm
      }
    }
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (process.env.NODE_ENV !== 'production') {
        if (
          !vnode.ns &&
          !(config.ignoredElements && config.ignoredElements.indexOf(tag) > -1) &&
          config.isUnknownElement(tag)
        ) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);
      createChildren(vnode, children, insertedVnodeQueue);
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
      }
    } else if (vnode.isComment) {
      vnode.elm = nodeOps.createComment(vnode.text);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
    }
    return vnode.elm
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        nodeOps.appendChild(vnode.elm, createElm(children[i], insertedVnodeQueue, true));
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.child) {
      vnode = vnode.child._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (i.create) { i.create(emptyNode, vnode); }
      if (i.insert) { insertedVnodeQueue.push(vnode); }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (vnode.data.pendingInsert) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
    }
    vnode.elm = vnode.child.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.context) && isDef(i = i.$options._scopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
    if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        isDef(i = i.$options._scopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      nodeOps.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          nodeOps.removeChild(parentElm, ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (rm || isDef(vnode.data)) {
      var listeners = cbs.remove.length + 1;
      if (!rm) {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      } else {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.child) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeElement(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
        if (isUndef(idxInOld)) { // New element
          nodeOps.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !elmToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (elmToMove.tag !== newStartVnode.tag) {
            // same key but different element. treat as new element
            nodeOps.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          }
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      before = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }
    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (vnode.isStatic &&
        oldVnode.isStatic &&
        vnode.key === oldVnode.key &&
        (vnode.isCloned || vnode.isOnce)) {
      vnode.elm = oldVnode.elm;
      return
    }
    var i;
    var data = vnode.data;
    var hasData = isDef(data);
    if (hasData && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }
    var elm = vnode.elm = oldVnode.elm;
    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (hasData && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (hasData) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (initial && vnode.parent) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var bailed = false;
  function hydrate (elm, vnode, insertedVnodeQueue) {
    if (process.env.NODE_ENV !== 'production') {
      if (!assertNodeMatch(elm, vnode)) {
        return false
      }
    }
    vnode.elm = elm;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.child)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        var childNodes = nodeOps.childNodes(elm);
        // empty element, allow client to pick up and populate children
        if (!childNodes.length) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          var childrenMatch = true;
          if (childNodes.length !== children.length) {
            childrenMatch = false;
          } else {
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!hydrate(childNodes[i$1], children[i$1], insertedVnodeQueue)) {
                childrenMatch = false;
                break
              }
            }
          }
          if (!childrenMatch) {
            if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !bailed) {
              bailed = true;
              console.warn('Parent: ', elm);
              console.warn('Mismatching childNodes vs. VNodes: ', childNodes, children);
            }
            return false
          }
        }
      }
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
      }
    }
    return true
  }

  function assertNodeMatch (node, vnode) {
    if (vnode.tag) {
      return (
        vnode.tag.indexOf('vue-component') === 0 ||
        vnode.tag.toLowerCase() === nodeOps.tagName(node).toLowerCase()
      )
    } else {
      return _toString(vnode.text) === node.data
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (!vnode) {
      if (oldVnode) { invokeDestroyHook(oldVnode); }
      return
    }

    var elm, parent;
    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (!oldVnode) {
      // empty mount, create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute('server-rendered')) {
            oldVnode.removeAttribute('server-rendered');
            hydrating = true;
          }
          if (hydrating) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }
        elm = oldVnode.elm;
        parent = nodeOps.parentNode(elm);

        createElm(vnode, insertedVnodeQueue);

        // component root element replaced.
        // update parent placeholder node element.
        if (vnode.parent) {
          vnode.parent.elm = vnode.elm;
          if (isPatchable(vnode)) {
            for (var i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode.parent);
            }
          }
        }

        if (parent !== null) {
          nodeOps.insertBefore(parent, vnode.elm, nodeOps.nextSibling(elm));
          removeVnodes(parent, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (
  oldVnode,
  vnode
) {
  if (!oldVnode.data.directives && !vnode.data.directives) {
    return
  }
  var isCreate = oldVnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      dirsWithInsert.forEach(function (dir) {
        callHook$1(dir, 'inserted', vnode, oldVnode);
      });
    };
    if (isCreate) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert, 'dir-insert');
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
      dirsWithPostpatch.forEach(function (dir) {
        callHook$1(dir, 'componentUpdated', vnode, oldVnode);
      });
    }, 'dir-postpatch');
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    fn(vnode.elm, dir, vnode, oldVnode);
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  if (!oldVnode.data.attrs && !vnode.data.attrs) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (attrs.__ob__) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  for (key in oldAttrs) {
    if (attrs[key] == null) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, key);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (!data.staticClass && !data.class &&
      (!oldData || (!oldData.staticClass && !oldData.class))) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (transitionClass) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

// skip type checking this file because we need to attach private properties
// to elements

function updateDOMListeners (oldVnode, vnode) {
  if (!oldVnode.data.on && !vnode.data.on) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  var add = vnode.elm._v_add || (vnode.elm._v_add = function (event, handler, capture) {
    vnode.elm.addEventListener(event, handler, capture);
  });
  var remove = vnode.elm._v_remove || (vnode.elm._v_remove = function (event, handler) {
    vnode.elm.removeEventListener(event, handler);
  });
  updateListeners(on, oldOn, add, remove, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (!oldVnode.data.domProps && !vnode.data.domProps) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (props.__ob__) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (props[key] == null) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
    }
    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = cur == null ? '' : String(cur);
      if (elm.value !== strCur && !elm.composing) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var hasBackground = cssText.indexOf('background') >= 0;
  // maybe with background-image: url(http://xxx) or base64 img
  var listDelimiter = hasBackground ? /;(?![^(]*\))/g : ';';
  var propertyDelimiter = hasBackground ? /:(.+)/ : ':';
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.child) {
      childNode = childNode.child._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else {
    el.style[normalize(name)] = val;
  }
};

var prefixes = ['Webkit', 'Moz', 'ms'];

var testEl;
var normalize = cached(function (prop) {
  testEl = testEl || document.createElement('div');
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in testEl.style)) {
    return prop
  }
  var upper = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < prefixes.length; i++) {
    var prefixed = prefixes[i] + upper;
    if (prefixed in testEl.style) {
      return prefixed
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (!data.staticStyle && !data.style &&
      !oldData.staticStyle && !oldData.style) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldVnode.data.staticStyle;
  var oldStyleBinding = oldVnode.data.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  vnode.data.style = style.__ob__ ? extend({}, style) : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (newStyle[name] == null) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !cls.trim()) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = ' ' + el.getAttribute('class') + ' ';
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !cls.trim()) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
  } else {
    var cur = ' ' + el.getAttribute('class') + ' ';
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    el.setAttribute('class', cur.trim());
  }
}

/*  */

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

var raf = (inBrowser && window.requestAnimationFrame) || setTimeout;
function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  (el._transitionClasses || (el._transitionClasses = [])).push(cls);
  addClass(el, cls);
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove$1(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitioneDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitioneDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode) {
  var el = vnode.elm;

  // call leave callback now
  if (el._leaveCb) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (!data) {
    return
  }

  /* istanbul ignore if */
  if (el._enterCb || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var transitionNode = activeInstance.$vnode;
  var context = transitionNode && transitionNode.parent
    ? transitionNode.parent.context
    : activeInstance;

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear ? appearClass : enterClass;
  var activeClass = isAppear ? appearActiveClass : enterActiveClass;
  var beforeEnterHook = isAppear ? (beforeAppear || beforeEnter) : beforeEnter;
  var enterHook = isAppear ? (typeof appear === 'function' ? appear : enter) : enter;
  var afterEnterHook = isAppear ? (afterAppear || afterEnter) : afterEnter;
  var enterCancelledHook = isAppear ? (appearCancelled || enterCancelled) : enterCancelled;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl =
    enterHook &&
    // enterHook may be a bound method which exposes
    // the length of original fn as _length
    (enterHook._length || enterHook.length) > 1;

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    }, 'transition-insert');
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        whenTransitionEnds(el, type, cb);
      }
    });
  }

  if (vnode.data.show) {
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (el._enterCb) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (!data) {
    return rm()
  }

  /* istanbul ignore if */
  if (el._leaveCb || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl =
    leave &&
    // leave hook may be a bound method which exposes
    // the length of original fn as _length
    (leave._length || leave.length) > 1;

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          whenTransitionEnds(el, type, cb);
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    leaveClass: (name + "-leave"),
    appearClass: (name + "-enter"),
    enterActiveClass: (name + "-enter-active"),
    leaveActiveClass: (name + "-leave-active"),
    appearActiveClass: (name + "-enter-active")
  }
});

function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn();
    }
  }
}

var transition = inBrowser ? {
  create: function create (_, vnode) {
    if (!vnode.data.show) {
      enter(vnode);
    }
  },
  remove: function remove (vnode, rm) {
    /* istanbul ignore else */
    if (!vnode.data.show) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch$1 = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

var modelableTagRE = /^input|select|textarea|vue-component-[0-9]+(-[0-9a-zA-Z_-]*)?$/;

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var model = {
  inserted: function inserted (el, binding, vnode) {
    if (process.env.NODE_ENV !== 'production') {
      if (!modelableTagRE.test(vnode.tag)) {
        warn(
          "v-model is not supported on element type: <" + (vnode.tag) + ">. " +
          'If you are working with contenteditable, it\'s recommended to ' +
          'wrap a library dedicated for that purpose inside a custom component.',
          vnode.context
        );
      }
    }
    if (vnode.tag === 'select') {
      var cb = function () {
        setSelected(el, binding, vnode.context);
      };
      cb();
      /* istanbul ignore if */
      if (isIE || isEdge) {
        setTimeout(cb, 0);
      }
    } else if (
      (vnode.tag === 'textarea' || el.type === 'text') &&
      !binding.modifiers.lazy
    ) {
      if (!isAndroid) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd);
      }
      /* istanbul ignore if */
      if (isIE9) {
        el.vmodel = true;
      }
    }
  },
  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var needReset = el.multiple
        ? binding.value.some(function (v) { return hasNoMatchingOption(v, el.options); })
        : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, el.options);
      if (needReset) {
        trigger(el, 'change');
      }
    }
  }
};

function setSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    process.env.NODE_ENV !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  for (var i = 0, l = options.length; i < l; i++) {
    if (looseEqual(getValue(options[i]), value)) {
      return false
    }
  }
  return true
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.child && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.child._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    if (value && transition && !isIE9) {
      enter(vnode);
    }
    var originalDisplay = el.style.display === 'none' ? '' : el.style.display;
    el.style.display = value ? originalDisplay : 'none';
    el.__vOriginalDisplay = originalDisplay;
  },
  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    if (transition && !isIE9) {
      if (value) {
        enter(vnode);
        el.style.display = el.__vOriginalDisplay;
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  }
};

var platformDirectives = {
  model: model,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1].fn;
  }
  return data
}

function placeholder (h, rawChild) {
  return /\d-keep-alive$/.test(rawChild.tag)
    ? h('keep-alive')
    : null
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,
  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag; });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if (process.env.NODE_ENV !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if (process.env.NODE_ENV !== 'production' &&
        mode && mode !== 'in-out' && mode !== 'out-in') {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    var key = child.key = child.key == null || child.isStatic
      ? ("__v" + (child.tag + this._uid) + "__")
      : child.key;
    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (oldChild && oldChild.data && oldChild.key !== key) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);

      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        }, key);
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave, key);
        mergeVNodeHook(data, 'enterCancelled', performLeave, key);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) {
          delayedLeave = leave;
        }, key);
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final disired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (process.env.NODE_ENV !== 'production') {
          var opts = c.componentOptions;
          var name = opts
            ? (opts.Ctor.options.name || opts.tag)
            : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    var f = document.body.offsetHeight; // eslint-disable-line

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      if (this._hasMove != null) {
        return this._hasMove
      }
      addTransitionClass(el, moveClass);
      var info = getTransitionInfo(el);
      removeTransitionClass(el, moveClass);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$2.config.isUnknownElement = isUnknownElement;
Vue$2.config.isReservedTag = isReservedTag;
Vue$2.config.getTagNamespace = getTagNamespace;
Vue$2.config.mustUseProp = mustUseProp;

// install platform runtime directives & components
extend(Vue$2.options.directives, platformDirectives);
extend(Vue$2.options.components, platformComponents);

// install platform patch function
Vue$2.prototype.__patch__ = config._isServer ? noop : patch$1;

// wrap mount
Vue$2.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && !config._isServer ? query(el) : undefined;
  return this._mount(el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$2);
    } else if (
      process.env.NODE_ENV !== 'production' &&
      inBrowser && /Chrome\/\d+/.test(window.navigator.userAgent)
    ) {
      console.log(
        'Download the Vue Devtools for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
}, 0);

module.exports = Vue$2;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = "./../images/02Firstpicture.png";

/***/ }),
/* 5 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;
	var sourceMap = obj.sourceMap;

	if (media) {
		styleElement.setAttribute("media", media);
	}

	if (sourceMap) {
		// https://developer.chrome.com/devtools/docs/javascript-debugging
		// this makes source maps inside style tags work properly in Chrome
		css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */';
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.3.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2018-01-20T17:24Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return typeof obj === "function" && typeof obj.nodeType !== "number";
  };


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};




	var preservedScriptAttributes = {
		type: true,
		src: true,
		noModule: true
	};

	function DOMEval( code, doc, node ) {
		doc = doc || document;

		var i,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {
				if ( node[ i ] ) {
					script[ i ] = node[ i ];
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.3.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc, node );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		div.style.position = "absolute";
		scrollboxSizeVal = div.offsetWidth === 36 || "absolute";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5
		) );
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),
		val = curCSS( elem, dimension, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox;

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = valueIsBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ dimension ] );

	// Fall back to offsetWidth/offsetHeight when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	// Support: Android <=4.1 - 4.3 only
	// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
	if ( val === "auto" ||
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) {

		val = elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ];

		// offsetWidth/offsetHeight provide border-box values
		valueIsBorderBox = true;
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),
				isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra && boxModelAdjustment(
					elem,
					dimension,
					extra,
					isBorderBox,
					styles
				);

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && support.scrollboxSize() === styles.position ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = Date.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
		return jQuery;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );


/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, exports) {

module.exports = "./../images/20Bottompicture.png";

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(95)

/* script */
__vue_exports__ = __webpack_require__(66)

/* template */
var __vue_template__ = __webpack_require__(87)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "E:\\0_new_study\\00_2018study\\0_geodeer_git\\src\\compchild\\footer.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-097150d0"

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-097150d0", __vue_options__)
  } else {
    hotAPI.reload("data-v-097150d0", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] footer.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(99)

/* script */
__vue_exports__ = __webpack_require__(68)

/* template */
var __vue_template__ = __webpack_require__(91)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "E:\\0_new_study\\00_2018study\\0_geodeer_git\\src\\compchild\\top.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-3e9f3ea8"

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3e9f3ea8", __vue_options__)
  } else {
    hotAPI.reload("data-v-3e9f3ea8", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] top.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "\n*[data-v-097150d0] {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: Arial, \"Microsoft YaHei\", sans-serif;\n  color: #212121;\n  word-break: break-all;\n}\n.clearfix[data-v-097150d0]:after {\n  content: \"\";\n  display: block;\n  zoom: 1;\n  clear: both;\n  height: 0;\n}\n.hide[data-v-097150d0] {\n  display: none;\n  visibility: hidden;\n  width: 0;\n  height: 0;\n}\nli[data-v-097150d0] {\n  list-style: none;\n}\n.lr-tb[data-v-097150d0] {\n  -webkit-writing-mode: horizontal-tb;\n  writing-mode: lr-tb;\n  writing-mode: horizontal-tb;\n}\n.tb-rl[data-v-097150d0] {\n  -webkit-writing-mode: vertical-rl;\n  writing-mode: tb-rl;\n  writing-mode: vertical-rl;\n}\n.tb-lr[data-v-097150d0] {\n  -webkit-writing-mode: vertical-lr;\n  writing-mode: tb-rl;\n  writing-mode: vertical-lr;\n}\n.con_text *[data-v-097150d0] {\n  font-size: 14px;\n}\n.con_text img[data-v-097150d0] {\n  display: block;\n  max-width: 490px;\n  margin: 20px auto;\n}\n.con_text p[data-v-097150d0] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n}\n.con_text span[data-v-097150d0] {\n  padding-bottom: 20px;\n  font-size: 14px;\n  font-weight: normal;\n  display: block;\n}\n.con_text h5[data-v-097150d0] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n  font-size: 16px;\n  padding-bottom: 30px;\n}\n.con_text b[data-v-097150d0] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n  font-size: 12px;\n  font-weight: normal;\n  padding-bottom: 20px;\n}\n.con_text > .con_image[data-v-097150d0] {\n  display: flex;\n  justify-content: space-around;\n  margin: 0 auto;\n}\n/* 可以设置不同的进入和离开动画 */\n/* 设置持续时间和动画函数 */\n.slide-fade-enter-active[data-v-097150d0] {\n  transition: all .3s ease;\n}\n.slide-fade-leave-active[data-v-097150d0] {\n  transition: all 0s cubic-bezier(1, 0.5, 0.8, 1);\n}\n.slide-fade-enter[data-v-097150d0],\n.slide-fade-leave-to[data-v-097150d0] {\n  transform: translateX(10px);\n  opacity: 0;\n}\n.fade-enter-active[data-v-097150d0],\n.fade-leave-active[data-v-097150d0] {\n  transition: opacity .5s;\n}\n.fade-enter[data-v-097150d0],\n.fade-leave-to[data-v-097150d0] {\n  opacity: 0;\n}\n#water[data-v-097150d0] {\n  position: absolute;\n  width: calc(100% + 100px);\n  height: calc(100% + 100px);\n  background-image: url(" + __webpack_require__(4) + ");\n  background-position: bottom;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n.footer[data-v-097150d0] {\n  position: relative;\n}\n.footer_box[data-v-097150d0] {\n  position: relative;\n  width: 984px;\n  background: rgba(255, 255, 255, 0.5);\n  padding: 0 70px;\n  border-radius: 5px;\n}\n.footer_box > .footer_content[data-v-097150d0] {\n  position: relative;\n  padding-top: 90px;\n}\n.footer_box > .footer_content > div[data-v-097150d0] {\n  position: relative;\n  display: block;\n  float: left;\n  margin-left: 110px;\n  margin-bottom: 90px;\n}\n.footer_box > .footer_content > div > h5[data-v-097150d0] {\n  display: block;\n  font-size: 14px;\n  font-weight: normal;\n  color: #212121;\n  width: 60px;\n  text-align: center;\n  cursor: pointer;\n}\n.footer_box > .footer_content > div > ul[data-v-097150d0] {\n  position: relative;\n  width: 60px;\n  margin-top: 25px;\n}\n.footer_box > .footer_content > div > ul > li[data-v-097150d0] {\n  position: relative;\n  float: left;\n  margin-bottom: 12px;\n  font-size: 12px;\n  color: #212121;\n  white-space: nowrap;\n  left: 50%;\n  transform: translateX(-50%);\n  -ms-transform: translateX(-50%);\n  /* IE 9 */\n  -moz-transform: translateX(-50%);\n  /* Firefox */\n  -webkit-transform: translateX(-50%);\n  /* Safari 和 Chrome */\n  -o-transform: translateX(-50%);\n  /* Opera */\n}\n.footer_box > .footer_content > .footer_logo[data-v-097150d0] {\n  position: relative;\n  width: 175px;\n  height: 130px;\n  margin-left: 0;\n}\n.footer_box > .footer_content > .footer_logo > img[data-v-097150d0] {\n  display: block;\n  margin: 0 auto;\n}\n.footer_box > .footer_content > .footer_logo > img[data-v-097150d0]:first-child {\n  width: 80px;\n  height: 80px;\n}\n.footer_box > .footer_content > .footer_logo > img[data-v-097150d0]:last-child {\n  width: 175px;\n  height: 25px;\n  margin-top: 25px;\n}\n.footer_box > hr[data-v-097150d0] {\n  border: none;\n  border-bottom: 1px solid #212121;\n}\n.footer_box > .footer_concat > .footer_wqw[data-v-097150d0] {\n  position: relative;\n  width: 224px;\n  display: flex;\n  justify-content: space-between;\n  margin: 0 auto;\n  margin-top: 40px;\n  margin-bottom: 30px;\n}\n.footer_box > .footer_concat > .footer_wqw > span > img[data-v-097150d0] {\n  display: block;\n  height: 27px;\n}\n.footer_box > .footer_concat > .footer_comp[data-v-097150d0] {\n  position: relative;\n  padding-bottom: 35px;\n}\n.footer_box > .footer_concat > .footer_comp > p[data-v-097150d0] {\n  font-size: 12px;\n  color: #212121;\n  text-align: center;\n}\n", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "\n*[data-v-31208b80] {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: Arial, \"Microsoft YaHei\", sans-serif;\n  color: #212121;\n  word-break: break-all;\n}\n.clearfix[data-v-31208b80]:after {\n  content: \"\";\n  display: block;\n  zoom: 1;\n  clear: both;\n  height: 0;\n}\n.hide[data-v-31208b80] {\n  display: none;\n  visibility: hidden;\n  width: 0;\n  height: 0;\n}\nli[data-v-31208b80] {\n  list-style: none;\n}\n.lr-tb[data-v-31208b80] {\n  -webkit-writing-mode: horizontal-tb;\n  writing-mode: lr-tb;\n  writing-mode: horizontal-tb;\n}\n.tb-rl[data-v-31208b80] {\n  -webkit-writing-mode: vertical-rl;\n  writing-mode: tb-rl;\n  writing-mode: vertical-rl;\n}\n.tb-lr[data-v-31208b80] {\n  -webkit-writing-mode: vertical-lr;\n  writing-mode: tb-rl;\n  writing-mode: vertical-lr;\n}\n.con_text *[data-v-31208b80] {\n  font-size: 14px;\n}\n.con_text img[data-v-31208b80] {\n  display: block;\n  max-width: 490px;\n  margin: 20px auto;\n}\n.con_text p[data-v-31208b80] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n}\n.con_text span[data-v-31208b80] {\n  padding-bottom: 20px;\n  font-size: 14px;\n  font-weight: normal;\n  display: block;\n}\n.con_text h5[data-v-31208b80] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n  font-size: 16px;\n  padding-bottom: 30px;\n}\n.con_text b[data-v-31208b80] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n  font-size: 12px;\n  font-weight: normal;\n  padding-bottom: 20px;\n}\n.con_text > .con_image[data-v-31208b80] {\n  display: flex;\n  justify-content: space-around;\n  margin: 0 auto;\n}\n/* 可以设置不同的进入和离开动画 */\n/* 设置持续时间和动画函数 */\n.slide-fade-enter-active[data-v-31208b80] {\n  transition: all .3s ease;\n}\n.slide-fade-leave-active[data-v-31208b80] {\n  transition: all 0s cubic-bezier(1, 0.5, 0.8, 1);\n}\n.slide-fade-enter[data-v-31208b80],\n.slide-fade-leave-to[data-v-31208b80] {\n  transform: translateX(10px);\n  opacity: 0;\n}\n.fade-enter-active[data-v-31208b80],\n.fade-leave-active[data-v-31208b80] {\n  transition: opacity .5s;\n}\n.fade-enter[data-v-31208b80],\n.fade-leave-to[data-v-31208b80] {\n  opacity: 0;\n}\n#water[data-v-31208b80] {\n  position: absolute;\n  width: calc(100% + 100px);\n  height: calc(100% + 100px);\n  background-image: url(" + __webpack_require__(4) + ");\n  background-position: bottom;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n.manager_area[data-v-31208b80] {\n  position: relative;\n  margin: 0 auto;\n  width: 640px;\n  height: 410px;\n}\n.manager_area > .manager_info_box[data-v-31208b80] {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n.manager_area > .manager_info_box > ul[data-v-31208b80] {\n  position: relative;\n}\n.manager_area > .manager_info_box > ul > li[data-v-31208b80] {\n  position: absolute;\n  width: 640px;\n  left: 0;\n  top: 0;\n  background: #fff;\n}\n.manager_area > .manager_info_box > ul > li > .manager_info_pic[data-v-31208b80] {\n  position: relative;\n  padding-top: 25px;\n}\n.manager_area > .manager_info_box > ul > li > .manager_info_pic > img[data-v-31208b80] {\n  margin: 0 auto;\n  display: block;\n  width: 154px;\n  height: 154px;\n  border-radius: 50%;\n}\n.manager_area > .manager_info_box > ul > li > .manager_info_pic > p[data-v-31208b80] {\n  font-size: 14px;\n  text-align: center;\n  padding-top: 10px;\n}\n.manager_area > .manager_info_box > ul > li > .manager_info_pic > p > span[data-v-31208b80] {\n  letter-spacing: 5px;\n}\n.manager_area > .manager_info_box > ul > li > .manager_info_pic > p > b[data-v-31208b80] {\n  font-weight: normal;\n  font-size: 12px;\n}\n.manager_area > .manager_info_box > ul > li > .manager_info_text[data-v-31208b80] {\n  position: relative;\n  width: 640px;\n  height: 150px;\n  margin-top: 25px;\n  border: 1px solid #212121;\n}\n.manager_area > .manager_info_box > ul > li > .manager_info_text > p[data-v-31208b80] {\n  position: relative;\n  padding: 0 30px;\n  font-size: 14px;\n  text-align: center;\n  top: 50%;\n  transform: translateY(-50%);\n  -ms-transform: translateY(-50%);\n  /* IE 9 */\n  -moz-transform: translateY(-50%);\n  /* Firefox */\n  -webkit-transform: translateY(-50%);\n  /* Safari 和 Chrome */\n  -o-transform: translateY(-50%);\n  /* Opera */\n}\n@keyframes preMove {\nfrom {\n    left: -640px;\n}\nto {\n    left: 0px;\n}\n}\n@-webkit-keyframes preMove {\n  /*Safari and Chrome*/\nfrom {\n    left: -640px;\n}\nto {\n    left: 0px;\n}\n}\n@keyframes nextMove {\nfrom {\n    left: 640px;\n}\nto {\n    left: 0px;\n}\n}\n@-webkit-keyframes nextMove {\n  /*Safari and Chrome*/\nfrom {\n    left: 640px;\n}\nto {\n    left: 0px;\n}\n}\n.manager_area > .manager_info_box > ul .mg_slide_preActive[data-v-31208b80] {\n  animation: preMove 0.5s linear 1;\n  -webkit-animation: preMove 0.5s linear 1;\n  /*Safari and Chrome*/\n}\n.manager_area > .manager_info_box > ul .mg_slide_nextActive[data-v-31208b80] {\n  animation: nextMove 0.5s linear 1;\n  -webkit-animation: nextMove 0.5s linear 1;\n  /*Safari and Chrome*/\n}\n.manager_area > .manager_control[data-v-31208b80] {\n  position: absolute;\n  width: 100%;\n  bottom: 110px;\n  z-index: 98;\n}\n.manager_area > .manager_control > span[data-v-31208b80] {\n  position: absolute;\n  padding: 10px 10px;\n  border: none;\n  background: rgba(0, 0, 0, 0);\n  font-size: 26px;\n  cursor: pointer;\n}\n.manager_area > .manager_control > span[data-v-31208b80]:active {\n  background: rgba(0, 0, 0, 0.1);\n}\n.manager_area > .manager_control > span[data-v-31208b80]:first-child {\n  left: -40px;\n}\n.manager_area > .manager_control > span[data-v-31208b80]:last-child {\n  right: -40px;\n}\n", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "\n*[data-v-3d00e12a] {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: Arial, \"Microsoft YaHei\", sans-serif;\n  color: #212121;\n  word-break: break-all;\n}\n.clearfix[data-v-3d00e12a]:after {\n  content: \"\";\n  display: block;\n  zoom: 1;\n  clear: both;\n  height: 0;\n}\n.hide[data-v-3d00e12a] {\n  display: none;\n  visibility: hidden;\n  width: 0;\n  height: 0;\n}\nli[data-v-3d00e12a] {\n  list-style: none;\n}\n.lr-tb[data-v-3d00e12a] {\n  -webkit-writing-mode: horizontal-tb;\n  writing-mode: lr-tb;\n  writing-mode: horizontal-tb;\n}\n.tb-rl[data-v-3d00e12a] {\n  -webkit-writing-mode: vertical-rl;\n  writing-mode: tb-rl;\n  writing-mode: vertical-rl;\n}\n.tb-lr[data-v-3d00e12a] {\n  -webkit-writing-mode: vertical-lr;\n  writing-mode: tb-rl;\n  writing-mode: vertical-lr;\n}\n.con_text *[data-v-3d00e12a] {\n  font-size: 14px;\n}\n.con_text img[data-v-3d00e12a] {\n  display: block;\n  max-width: 490px;\n  margin: 20px auto;\n}\n.con_text p[data-v-3d00e12a] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n}\n.con_text span[data-v-3d00e12a] {\n  padding-bottom: 20px;\n  font-size: 14px;\n  font-weight: normal;\n  display: block;\n}\n.con_text h5[data-v-3d00e12a] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n  font-size: 16px;\n  padding-bottom: 30px;\n}\n.con_text b[data-v-3d00e12a] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n  font-size: 12px;\n  font-weight: normal;\n  padding-bottom: 20px;\n}\n.con_text > .con_image[data-v-3d00e12a] {\n  display: flex;\n  justify-content: space-around;\n  margin: 0 auto;\n}\n/* 可以设置不同的进入和离开动画 */\n/* 设置持续时间和动画函数 */\n.slide-fade-enter-active[data-v-3d00e12a] {\n  transition: all .3s ease;\n}\n.slide-fade-leave-active[data-v-3d00e12a] {\n  transition: all 0s cubic-bezier(1, 0.5, 0.8, 1);\n}\n.slide-fade-enter[data-v-3d00e12a],\n.slide-fade-leave-to[data-v-3d00e12a] {\n  transform: translateX(10px);\n  opacity: 0;\n}\n.fade-enter-active[data-v-3d00e12a],\n.fade-leave-active[data-v-3d00e12a] {\n  transition: opacity .5s;\n}\n.fade-enter[data-v-3d00e12a],\n.fade-leave-to[data-v-3d00e12a] {\n  opacity: 0;\n}\n#water[data-v-3d00e12a] {\n  position: absolute;\n  width: calc(100% + 100px);\n  height: calc(100% + 100px);\n  background-image: url(" + __webpack_require__(4) + ");\n  background-position: bottom;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n.contact_top[data-v-3d00e12a] {\n  position: relative;\n  height: 490px;\n  background-image: url(" + __webpack_require__(57) + ");\n  background-position: bottom;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n.contact_top > .contact_topTab[data-v-3d00e12a] {\n  position: relative;\n  width: 1200px;\n  padding-top: 32px;\n  margin: 0 auto;\n}\n.contact_top > .contact_topTab > .top[data-v-3d00e12a] {\n  background: #fffaf7;\n}\n.contact_assort[data-v-3d00e12a] {\n  position: relative;\n}\n.contact_assort > .contact_assort_area[data-v-3d00e12a] {\n  position: relative;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaTab[data-v-3d00e12a] {\n  position: relative;\n  display: flex;\n  justify-content: space-around;\n  width: 490px;\n  margin: 0 auto;\n  padding: 35px 50px;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaTab > span[data-v-3d00e12a] {\n  font-size: 12px;\n  cursor: pointer;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaTab > i[data-v-3d00e12a] {\n  line-height: 12px;\n  border: 1px solid #8EA595;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaTab .assortTabActive[data-v-3d00e12a] {\n  color: #8EA595;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail[data-v-3d00e12a] {\n  position: relative;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_feedback[data-v-3d00e12a],\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail .ca_areaDetail_contact[data-v-3d00e12a],\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail .ca_areaDetail_recruit[data-v-3d00e12a] {\n  position: relative;\n  padding-top: 85px;\n  padding-bottom: 150px;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_feedback[data-v-3d00e12a] {\n  width: 800px;\n  margin: 0 auto;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_feedback > .ca_areaDetail_feedback_contactInfo[data-v-3d00e12a] {\n  position: relative;\n  float: left;\n  width: 300px;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_feedback > .ca_areaDetail_feedback_contactInfo > p[data-v-3d00e12a] {\n  font-size: 14px;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_feedback > .ca_areaDetail_feedback_contactInfo > p > img[data-v-3d00e12a] {\n  display: block;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_feedback > .ca_areaDetail_feedback_contactInfo > p > b[data-v-3d00e12a] {\n  font-weight: normal;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_feedback > .ca_areaDetail_feedback_contactInfo > hr[data-v-3d00e12a] {\n  margin: 15px 0;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_feedback > .ca_areaDetail_feedback_input[data-v-3d00e12a] {\n  position: relative;\n  float: right;\n  width: 360px;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_feedback > .ca_areaDetail_feedback_input > p[data-v-3d00e12a] {\n  font-size: 14px;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_feedback > .ca_areaDetail_feedback_input > p > input[type=text][data-v-3d00e12a],\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_feedback > .ca_areaDetail_feedback_input > p input[type=textarea][data-v-3d00e12a] {\n  width: 100%;\n  line-height: 26px;\n  padding-left: 8px;\n  margin-bottom: 20px;\n  border: 1px solid #212121;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_feedback > .ca_areaDetail_feedback_input > p > input[type=button][data-v-3d00e12a] {\n  padding: 4px 12px;\n  background: #fff;\n  border: 1px solid #212121;\n  cursor: pointer;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_feedback > .ca_areaDetail_feedback_input > p > textarea[data-v-3d00e12a] {\n  width: 100%;\n  line-height: 26px;\n  padding-left: 8px;\n  margin-bottom: 20px;\n  border: 1px solid #212121;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_contact[data-v-3d00e12a] {\n  width: 800px;\n  margin: 0 auto;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_contact > .ca_areaDetail_contact_tab[data-v-3d00e12a] {\n  position: relative;\n  display: flex;\n  justify-content: space-around;\n  margin: 0 auto;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_contact > .ca_areaDetail_contact_tab > span[data-v-3d00e12a] {\n  display: block;\n  cursor: pointer;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_contact > .ca_areaDetail_contact_tab > span > img[data-v-3d00e12a] {\n  display: block;\n  width: 140px;\n  height: 140px;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_contact > .ca_areaDetail_contact_text[data-v-3d00e12a] {\n  position: relative;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_contact > .ca_areaDetail_contact_text > div[data-v-3d00e12a] {\n  position: relative;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_contact > .ca_areaDetail_contact_text > div > p[data-v-3d00e12a] {\n  position: relative;\n  float: left;\n  left: 50%;\n  transform: translateX(-50%);\n  -ms-transform: translateX(-50%);\n  /* IE 9 */\n  -moz-transform: translateX(-50%);\n  /* Firefox */\n  -webkit-transform: translateX(-50%);\n  /* Safari 和 Chrome */\n  -o-transform: translateX(-50%);\n  /* Opera */\n  padding: 25px 165px;\n  margin-top: 50px;\n  border-top: 1px solid #8EA595;\n  font-size: 14px;\n  color: #1F2020;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_recruit[data-v-3d00e12a] {\n  width: 490px;\n  margin: 0 auto;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_recruit > .ca_areaDetail_recruit_box[data-v-3d00e12a] {\n  position: relative;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_recruit > .ca_areaDetail_recruit_box > .ca_areaDetail_recruit_search > input[data-v-3d00e12a] {\n  display: block;\n  float: left;\n  width: 440px;\n  line-height: 30px;\n  padding-left: 8px;\n  font-size: 14px;\n  margin-right: 15px;\n  border: 1px solid #212121;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_recruit > .ca_areaDetail_recruit_box > .ca_areaDetail_recruit_search > span[data-v-3d00e12a] {\n  display: block;\n  float: left;\n  width: 30px;\n  height: 30px;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_recruit > .ca_areaDetail_recruit_box > .ca_areaDetail_recruit_search > span > img[data-v-3d00e12a] {\n  display: block;\n  margin: 0 auto;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_recruit > .ca_areaDetail_recruit_box > .ca_areaDetail_recruit_list[data-v-3d00e12a] {\n  position: relative;\n  padding-top: 15px;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_recruit > .ca_areaDetail_recruit_box > .ca_areaDetail_recruit_list > .recruit_list_nav[data-v-3d00e12a] {\n  position: relative;\n  background: #8EA595;\n  padding: 7px 0;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_recruit > .ca_areaDetail_recruit_box > .ca_areaDetail_recruit_list > .recruit_list_nav > span[data-v-3d00e12a] {\n  display: block;\n  float: left;\n  line-height: 1;\n  text-align: center;\n  border-right: 1px solid #fff;\n  color: #fff;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_recruit > .ca_areaDetail_recruit_box > .ca_areaDetail_recruit_list > .recruit_list_nav > span[data-v-3d00e12a]:last-child {\n  border-right: none;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_recruit > .ca_areaDetail_recruit_box > .ca_areaDetail_recruit_list > .recruit_list_ul[data-v-3d00e12a] {\n  position: relative;\n  padding-top: 20px;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_recruit > .ca_areaDetail_recruit_box > .ca_areaDetail_recruit_list > .recruit_list_ul > ul[data-v-3d00e12a] {\n  list-style: none;\n  overflow: auto;\n  max-height: 500px;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_recruit > .ca_areaDetail_recruit_box > .ca_areaDetail_recruit_list > .recruit_list_ul > ul > li[data-v-3d00e12a] {\n  position: relative;\n  padding: 7px 0;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_recruit > .ca_areaDetail_recruit_box > .ca_areaDetail_recruit_list > .recruit_list_ul > ul > li > span[data-v-3d00e12a] {\n  display: block;\n  float: left;\n  line-height: 1;\n  text-align: center;\n  border-right: 1px solid #fff;\n  color: #212121;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_recruit > .ca_areaDetail_recruit_detail[data-v-3d00e12a] {\n  position: relative;\n  background: #fff;\n  left: 0;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_recruit > .ca_areaDetail_recruit_detail > .ca_areaDetail_recruit_detail_close[data-v-3d00e12a] {\n  position: absolute;\n  right: -50px;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_recruit > .ca_areaDetail_recruit_detail > .ca_areaDetail_recruit_detail_close > i[data-v-3d00e12a] {\n  display: block;\n  font-style: normal;\n  height: 30px;\n  line-height: 30px;\n  width: 30px;\n  border: 1px solid #aaa;\n  border-radius: 50%;\n  text-align: center;\n  color: #aaa;\n  cursor: pointer;\n  font-size: 20px;\n}\n.contact_assort > .contact_assort_area > .contact_assort_areaDetail > .ca_areaDetail_recruit > .ca_areaDetail_recruit_detail > .ca_areaDetail_recruit_detail_close > i[data-v-3d00e12a]:active {\n  color: #212121;\n  border: 1px solid #212121;\n}\n.contact_footer[data-v-3d00e12a] {\n  position: relative;\n  height: 700px;\n  background-image: url(" + __webpack_require__(8) + ");\n  background-position: bottom;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n.contact_footer > .contact_footerBox[data-v-3d00e12a] {\n  position: relative;\n  margin: 0 auto;\n  padding-top: 160px;\n  width: 984px;\n}\n", ""]);

// exports


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "\n*[data-v-3e9f3ea8] {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: Arial, \"Microsoft YaHei\", sans-serif;\n  color: #212121;\n  word-break: break-all;\n}\n.clearfix[data-v-3e9f3ea8]:after {\n  content: \"\";\n  display: block;\n  zoom: 1;\n  clear: both;\n  height: 0;\n}\n.hide[data-v-3e9f3ea8] {\n  display: none;\n  visibility: hidden;\n  width: 0;\n  height: 0;\n}\nli[data-v-3e9f3ea8] {\n  list-style: none;\n}\n.lr-tb[data-v-3e9f3ea8] {\n  -webkit-writing-mode: horizontal-tb;\n  writing-mode: lr-tb;\n  writing-mode: horizontal-tb;\n}\n.tb-rl[data-v-3e9f3ea8] {\n  -webkit-writing-mode: vertical-rl;\n  writing-mode: tb-rl;\n  writing-mode: vertical-rl;\n}\n.tb-lr[data-v-3e9f3ea8] {\n  -webkit-writing-mode: vertical-lr;\n  writing-mode: tb-rl;\n  writing-mode: vertical-lr;\n}\n.con_text *[data-v-3e9f3ea8] {\n  font-size: 14px;\n}\n.con_text img[data-v-3e9f3ea8] {\n  display: block;\n  max-width: 490px;\n  margin: 20px auto;\n}\n.con_text p[data-v-3e9f3ea8] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n}\n.con_text span[data-v-3e9f3ea8] {\n  padding-bottom: 20px;\n  font-size: 14px;\n  font-weight: normal;\n  display: block;\n}\n.con_text h5[data-v-3e9f3ea8] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n  font-size: 16px;\n  padding-bottom: 30px;\n}\n.con_text b[data-v-3e9f3ea8] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n  font-size: 12px;\n  font-weight: normal;\n  padding-bottom: 20px;\n}\n.con_text > .con_image[data-v-3e9f3ea8] {\n  display: flex;\n  justify-content: space-around;\n  margin: 0 auto;\n}\n/* 可以设置不同的进入和离开动画 */\n/* 设置持续时间和动画函数 */\n.slide-fade-enter-active[data-v-3e9f3ea8] {\n  transition: all .3s ease;\n}\n.slide-fade-leave-active[data-v-3e9f3ea8] {\n  transition: all 0s cubic-bezier(1, 0.5, 0.8, 1);\n}\n.slide-fade-enter[data-v-3e9f3ea8],\n.slide-fade-leave-to[data-v-3e9f3ea8] {\n  transform: translateX(10px);\n  opacity: 0;\n}\n.fade-enter-active[data-v-3e9f3ea8],\n.fade-leave-active[data-v-3e9f3ea8] {\n  transition: opacity .5s;\n}\n.fade-enter[data-v-3e9f3ea8],\n.fade-leave-to[data-v-3e9f3ea8] {\n  opacity: 0;\n}\n#water[data-v-3e9f3ea8] {\n  position: absolute;\n  width: calc(100% + 100px);\n  height: calc(100% + 100px);\n  background-image: url(" + __webpack_require__(4) + ");\n  background-position: bottom;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n.top[data-v-3e9f3ea8] {\n  position: relative;\n}\n.top_tab[data-v-3e9f3ea8] {\n  position: relative;\n  width: 1200px;\n  margin: 0 auto;\n}\n.top_tab > .top_logo[data-v-3e9f3ea8] {\n  position: relative;\n  float: left;\n  padding: 6px;\n}\n.top_tab > .top_logo > img[data-v-3e9f3ea8] {\n  display: block;\n  width: 50px;\n  height: 50px;\n}\n.top_tab > .top_order[data-v-3e9f3ea8] {\n  position: relative;\n  float: left;\n  padding-top: 4px;\n  margin-left: 20px;\n}\n.top_tab > .top_order > p.ordersEn > span[data-v-3e9f3ea8] {\n  position: relative;\n  font-size: 14px;\n  font-weight: bold;\n  color: #212121;\n  line-height: 26px;\n  margin: 0 30px;\n  cursor: pointer;\n}\n.top_tab > .top_order > p.ordersEn > span > b[data-v-3e9f3ea8] {\n  position: absolute;\n  font-size: 12px;\n  font-weight: normal;\n  width: auto;\n  bottom: -27px;\n  text-align: center;\n  left: 50%;\n  line-height: 1;\n  white-space: nowrap;\n  transform: translateX(-50%);\n  -ms-transform: translateX(-50%);\n  /* IE 9 */\n  -moz-transform: translateX(-50%);\n  /* Firefox */\n  -webkit-transform: translateX(-50%);\n  /* Safari 和 Chrome */\n  -o-transform: translateX(-50%);\n  /* Opera */\n}\n.top_tab > .top_order > p.ordersEn .tabActive[data-v-3e9f3ea8] {\n  color: #8EA595;\n}\n.top_tab > .top_order > hr[data-v-3e9f3ea8] {\n  border: none;\n  border-bottom: 1px solid #212121;\n  cursor: pointer;\n}\n.top_tab > .top_others[data-v-3e9f3ea8] {\n  position: relative;\n  float: right;\n}\n.top_tab > .top_others > img[data-v-3e9f3ea8] {\n  float: left;\n  display: block;\n  width: 50px;\n  height: 50px;\n  padding: 8px;\n  margin: 6px 0;\n  background-repeat: no-repeat;\n  background-size: 135px 34px;\n}\n", ""]);

// exports


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "\n*[data-v-592f67b8] {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: Arial, \"Microsoft YaHei\", sans-serif;\n  color: #212121;\n  word-break: break-all;\n}\n.clearfix[data-v-592f67b8]:after {\n  content: \"\";\n  display: block;\n  zoom: 1;\n  clear: both;\n  height: 0;\n}\n.hide[data-v-592f67b8] {\n  display: none;\n  visibility: hidden;\n  width: 0;\n  height: 0;\n}\nli[data-v-592f67b8] {\n  list-style: none;\n}\n.lr-tb[data-v-592f67b8] {\n  -webkit-writing-mode: horizontal-tb;\n  writing-mode: lr-tb;\n  writing-mode: horizontal-tb;\n}\n.tb-rl[data-v-592f67b8] {\n  -webkit-writing-mode: vertical-rl;\n  writing-mode: tb-rl;\n  writing-mode: vertical-rl;\n}\n.tb-lr[data-v-592f67b8] {\n  -webkit-writing-mode: vertical-lr;\n  writing-mode: tb-rl;\n  writing-mode: vertical-lr;\n}\n.con_text *[data-v-592f67b8] {\n  font-size: 14px;\n}\n.con_text img[data-v-592f67b8] {\n  display: block;\n  max-width: 490px;\n  margin: 20px auto;\n}\n.con_text p[data-v-592f67b8] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n}\n.con_text span[data-v-592f67b8] {\n  padding-bottom: 20px;\n  font-size: 14px;\n  font-weight: normal;\n  display: block;\n}\n.con_text h5[data-v-592f67b8] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n  font-size: 16px;\n  padding-bottom: 30px;\n}\n.con_text b[data-v-592f67b8] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n  font-size: 12px;\n  font-weight: normal;\n  padding-bottom: 20px;\n}\n.con_text > .con_image[data-v-592f67b8] {\n  display: flex;\n  justify-content: space-around;\n  margin: 0 auto;\n}\n/* 可以设置不同的进入和离开动画 */\n/* 设置持续时间和动画函数 */\n.slide-fade-enter-active[data-v-592f67b8] {\n  transition: all .3s ease;\n}\n.slide-fade-leave-active[data-v-592f67b8] {\n  transition: all 0s cubic-bezier(1, 0.5, 0.8, 1);\n}\n.slide-fade-enter[data-v-592f67b8],\n.slide-fade-leave-to[data-v-592f67b8] {\n  transform: translateX(10px);\n  opacity: 0;\n}\n.fade-enter-active[data-v-592f67b8],\n.fade-leave-active[data-v-592f67b8] {\n  transition: opacity .5s;\n}\n.fade-enter[data-v-592f67b8],\n.fade-leave-to[data-v-592f67b8] {\n  opacity: 0;\n}\n#water[data-v-592f67b8] {\n  position: absolute;\n  width: calc(100% + 100px);\n  height: calc(100% + 100px);\n  background-image: url(" + __webpack_require__(4) + ");\n  background-position: bottom;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\nbody[data-v-592f67b8] {\n  width: 100%;\n  height: 100%;\n}\n.h_top[data-v-592f67b8] {\n  position: relative;\n  overflow: hidden;\n  width: 100%;\n  height: 850px;\n}\n.h_top > .h_topTab[data-v-592f67b8] {\n  position: relative;\n  padding-top: 32px;\n  margin: 0 auto;\n}\n.h_top > .h_topTab > .top[data-v-592f67b8] {\n  background: #fffaf7;\n}\n.h_top > .h_topLogo[data-v-592f67b8] {\n  position: relative;\n  margin-top: 170px;\n}\n.h_top > .h_topLogo > img[data-v-592f67b8] {\n  position: relative;\n  width: 796px;\n  height: 166px;\n  display: block;\n  margin: 0 auto;\n}\n.h_top > .h_topLogo > p[data-v-592f67b8] {\n  position: relative;\n  display: block;\n  text-align: center;\n  font-size: 16px;\n  font-family: HYQiHei;\n  letter-spacing: 2px;\n  color: #fff;\n  margin-top: 15px;\n}\n.h_content[data-v-592f67b8] {\n  position: relative;\n  background-image: url(" + __webpack_require__(40) + ");\n  background-size: 1200px auto;\n  background-position: top;\n  background-repeat: no-repeat;\n}\n.h_content > .hc_about[data-v-592f67b8] {\n  position: relative;\n  width: 1200px;\n  margin: 0 auto;\n}\n.h_content > .hc_about > .hc_about_title[data-v-592f67b8] {\n  position: relative;\n  padding-top: 10px;\n}\n.h_content > .hc_about > .hc_about_title > p[data-v-592f67b8] {\n  position: relative;\n  text-align: center;\n  font-size: 12px;\n}\n.h_content > .hc_about > .hc_about_content[data-v-592f67b8] {\n  position: relative;\n  padding: 80px 110px 0 110px;\n}\n.h_content > .hc_about > .hc_about_content > .hc_about_cPic[data-v-592f67b8] {\n  position: relative;\n  float: left;\n}\n.h_content > .hc_about > .hc_about_content > .hc_about_cPic > img[data-v-592f67b8] {\n  display: block;\n  width: 488px;\n  height: 188px;\n}\n.h_content > .hc_about > .hc_about_content > .hc_about_cText[data-v-592f67b8] {\n  position: relative;\n  float: right;\n  width: 440px;\n}\n.h_content > .hc_about > .hc_about_content > .hc_about_cText > p[data-v-592f67b8] {\n  font-size: 14px;\n}\n.h_content > .hc_about > .hc_about_btn[data-v-592f67b8] {\n  position: relative;\n}\n.h_content > .hc_about > .hc_about_btn > input[data-v-592f67b8] {\n  position: relative;\n  left: 50%;\n  margin-left: 50px;\n  margin-top: 70px;\n  font-size: 12px;\n  border: 1px solid #212121;\n  background: #fff;\n  padding: 7px 17px;\n  cursor: pointer;\n}\n.h_content > .hc_product[data-v-592f67b8] {\n  position: relative;\n  width: 1200px;\n  margin: 0 auto;\n}\n.h_content > .hc_product > .hc_product_title[data-v-592f67b8] {\n  position: relative;\n}\n.h_content > .hc_product > .hc_product_title > div[data-v-592f67b8] {\n  position: relative;\n  float: left;\n  margin-top: 60px;\n  left: 50%;\n  transform: translateX(-50%);\n  -ms-transform: translateX(-50%);\n  /* IE 9 */\n  -moz-transform: translateX(-50%);\n  /* Firefox */\n  -webkit-transform: translateX(-50%);\n  /* Safari 和 Chrome */\n  -o-transform: translateX(-50%);\n  /* Opera */\n}\n.h_content > .hc_product > .hc_product_title > div > img[data-v-592f67b8] {\n  float: left;\n  display: block;\n  width: 50px;\n  height: 50px;\n  padding: 8px;\n  margin: 6px 0;\n  background-repeat: no-repeat;\n  background-size: 135px 34px;\n}\n.h_content > .hc_product > .hc_product_content[data-v-592f67b8] {\n  position: relative;\n  padding-top: 70px;\n  padding-bottom: 100px;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow[data-v-592f67b8] {\n  position: relative;\n  float: left;\n  width: 33.333333%;\n  height: 520px;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > img[data-v-592f67b8] {\n  position: absolute;\n  display: block;\n  width: 100%;\n  height: 520px;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_shadow[data-v-592f67b8] {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  z-index: 2;\n  opacity: 0;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_shadow > .shadow_lineTop[data-v-592f67b8] {\n  position: relative;\n  margin: 0 auto;\n  margin-top: 50px;\n  width: 0px;\n  border: 1px solid #212121;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_shadow > .shadow_circle[data-v-592f67b8] {\n  position: relative;\n  margin: 0 auto;\n  width: 6px;\n  height: 6px;\n  border: 1px solid #212121;\n  border-radius: 50%;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_shadow > .shadow_text[data-v-592f67b8] {\n  position: relative;\n  text-align: center;\n  padding: 15px 30px;\n  font-size: 12px;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_shadow > .shadow_text > span[data-v-592f67b8] {\n  line-height: 14px;\n  font-family: AvenirLT;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_shadow > .shadow_text > b[data-v-592f67b8] {\n  line-height: 26px;\n  font-family: HYQiHei;\n  font-weight: normal;\n  letter-spacing: 2px;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_shadow > .shadow_lineBottom[data-v-592f67b8] {\n  position: relative;\n  margin: 0 auto;\n  margin-bottom: 50px;\n  width: 0px;\n  height: 100px;\n  border: 1px solid #212121;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow .hc_product_cShow_shadow[data-v-592f67b8]:hover {\n  opacity: 1;\n  background: rgba(255, 255, 255, 0.5);\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_light[data-v-592f67b8] {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  z-index: 2;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_light > .light_advert[data-v-592f67b8] {\n  position: relative;\n  margin: 0 auto;\n  padding-top: 15px;\n  font-size: 14px;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_light > .light_line[data-v-592f67b8] {\n  position: relative;\n  margin: 15px auto;\n  width: 0px;\n  border: 1px solid #212121;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_light > .light_pic[data-v-592f67b8] {\n  position: relative;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_light > .light_pic > img[data-v-592f67b8] {\n  position: relative;\n  display: block;\n  margin: 0 auto;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_light > .light_pic > p[data-v-592f67b8] {\n  text-align: center;\n  font-size: 12px;\n  font-family: AvenirLT;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_weight[data-v-592f67b8] {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  z-index: 2;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_weight > .weight_advert[data-v-592f67b8] {\n  position: relative;\n  margin: 0 auto;\n  padding-top: 15px;\n  font-size: 14px;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_weight > .weight_line[data-v-592f67b8] {\n  position: relative;\n  margin: 15px auto;\n  width: 0px;\n  border: 1px solid #212121;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_weight > .weight_pic[data-v-592f67b8] {\n  position: relative;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_weight > .weight_pic > img[data-v-592f67b8] {\n  position: relative;\n  display: block;\n  margin: 0 auto;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow > .hc_product_cShow_weight > .weight_pic > p[data-v-592f67b8] {\n  text-align: center;\n  font-size: 12px;\n  font-family: AvenirLT;\n}\n.h_content > .hc_product > .hc_product_content > .hc_product_cShow4[data-v-592f67b8] {\n  width: 66.666666%;\n}\n.h_content > .hc_manager[data-v-592f67b8] {\n  position: relative;\n  padding-bottom: 85px;\n}\n.h_content > .hc_manager > .hc_manager_title[data-v-592f67b8] {\n  position: relative;\n}\n.h_content > .hc_manager > .hc_manager_title > p[data-v-592f67b8] {\n  font-size: 14px;\n  text-align: center;\n}\n.h_content > .hc_manager > .hc_manager_title > i[data-v-592f67b8] {\n  position: relative;\n  margin: 0 auto;\n  margin-top: 20px;\n  display: block;\n  width: 50px;\n  border-bottom: 1px solid #91A698;\n}\n.h_content > .hc_cooperate[data-v-592f67b8] {\n  position: relative;\n  padding-bottom: 165px;\n}\n.h_content > .hc_cooperate > div[data-v-592f67b8] {\n  position: relative;\n  width: 800px;\n  margin: 0 auto;\n  display: flex;\n  justify-content: space-between;\n}\n.h_content > .hc_cooperate > div > img[data-v-592f67b8] {\n  display: block;\n  height: 30px;\n}\n.h_footer[data-v-592f67b8] {\n  position: relative;\n  height: 700px;\n  background-image: url(" + __webpack_require__(8) + ");\n  background-position: bottom;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n.h_footer > .h_footerBox[data-v-592f67b8] {\n  position: relative;\n  margin: 0 auto;\n  padding-top: 160px;\n  width: 984px;\n}\n", ""]);

// exports


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "\n*[data-v-63b2bdd0] {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: Arial, \"Microsoft YaHei\", sans-serif;\n  color: #212121;\n  word-break: break-all;\n}\n.clearfix[data-v-63b2bdd0]:after {\n  content: \"\";\n  display: block;\n  zoom: 1;\n  clear: both;\n  height: 0;\n}\n.hide[data-v-63b2bdd0] {\n  display: none;\n  visibility: hidden;\n  width: 0;\n  height: 0;\n}\nli[data-v-63b2bdd0] {\n  list-style: none;\n}\n.lr-tb[data-v-63b2bdd0] {\n  -webkit-writing-mode: horizontal-tb;\n  writing-mode: lr-tb;\n  writing-mode: horizontal-tb;\n}\n.tb-rl[data-v-63b2bdd0] {\n  -webkit-writing-mode: vertical-rl;\n  writing-mode: tb-rl;\n  writing-mode: vertical-rl;\n}\n.tb-lr[data-v-63b2bdd0] {\n  -webkit-writing-mode: vertical-lr;\n  writing-mode: tb-rl;\n  writing-mode: vertical-lr;\n}\n.con_text *[data-v-63b2bdd0] {\n  font-size: 14px;\n}\n.con_text img[data-v-63b2bdd0] {\n  display: block;\n  max-width: 490px;\n  margin: 20px auto;\n}\n.con_text p[data-v-63b2bdd0] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n}\n.con_text span[data-v-63b2bdd0] {\n  padding-bottom: 20px;\n  font-size: 14px;\n  font-weight: normal;\n  display: block;\n}\n.con_text h5[data-v-63b2bdd0] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n  font-size: 16px;\n  padding-bottom: 30px;\n}\n.con_text b[data-v-63b2bdd0] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n  font-size: 12px;\n  font-weight: normal;\n  padding-bottom: 20px;\n}\n.con_text > .con_image[data-v-63b2bdd0] {\n  display: flex;\n  justify-content: space-around;\n  margin: 0 auto;\n}\n/* 可以设置不同的进入和离开动画 */\n/* 设置持续时间和动画函数 */\n.slide-fade-enter-active[data-v-63b2bdd0] {\n  transition: all .3s ease;\n}\n.slide-fade-leave-active[data-v-63b2bdd0] {\n  transition: all 0s cubic-bezier(1, 0.5, 0.8, 1);\n}\n.slide-fade-enter[data-v-63b2bdd0],\n.slide-fade-leave-to[data-v-63b2bdd0] {\n  transform: translateX(10px);\n  opacity: 0;\n}\n.fade-enter-active[data-v-63b2bdd0],\n.fade-leave-active[data-v-63b2bdd0] {\n  transition: opacity .5s;\n}\n.fade-enter[data-v-63b2bdd0],\n.fade-leave-to[data-v-63b2bdd0] {\n  opacity: 0;\n}\n#water[data-v-63b2bdd0] {\n  position: absolute;\n  width: calc(100% + 100px);\n  height: calc(100% + 100px);\n  background-image: url(" + __webpack_require__(4) + ");\n  background-position: bottom;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n.about_top[data-v-63b2bdd0] {\n  position: relative;\n  height: 490px;\n  background-image: url(" + __webpack_require__(75) + ");\n  background-position: bottom;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n.about_top > .about_topTab[data-v-63b2bdd0] {\n  position: relative;\n  padding-top: 32px;\n  margin: 0 auto;\n}\n.about_top > .about_topTab > .top[data-v-63b2bdd0] {\n  background: #fffaf7;\n}\n.about_content[data-v-63b2bdd0] {\n  position: relative;\n}\n.about_content > .about_contentTab[data-v-63b2bdd0] {\n  position: relative;\n}\n.about_content > .about_contentTab > .about_contentTab_order[data-v-63b2bdd0] {\n  position: relative;\n  display: flex;\n  justify-content: space-around;\n  width: 490px;\n  margin: 0 auto;\n  padding: 35px 50px;\n}\n.about_content > .about_contentTab > .about_contentTab_order > span[data-v-63b2bdd0] {\n  font-size: 12px;\n  cursor: pointer;\n}\n.about_content > .about_contentTab > .about_contentTab_order > i[data-v-63b2bdd0] {\n  line-height: 12px;\n  border: 1px solid #8EA595;\n}\n.about_content > .about_contentTab > .about_contentTab_order .contentTabActive[data-v-63b2bdd0] {\n  color: #8EA595;\n}\n.about_content > .about_contentTab > .about_content_assort[data-v-63b2bdd0] {\n  position: relative;\n  padding-bottom: 150px;\n}\n.about_content > .about_contentTab > .about_content_assort > .ac_assort_news[data-v-63b2bdd0] {\n  position: relative;\n}\n.about_content > .about_contentTab > .about_content_assort > .ac_assort_news > .ac_assort_newsPages[data-v-63b2bdd0] {\n  position: relative;\n  width: 1000px;\n  margin: 0 auto;\n  max-height: 510px;\n  overflow: auto;\n}\n.about_content > .about_contentTab > .about_content_assort > .ac_assort_news > .ac_assort_newsPages > .ac_assort_newsPages_box[data-v-63b2bdd0] {\n  position: relative;\n  width: 100%;\n  display: flex;\n  justify-content: space-between;\n  flex-wrap: wrap;\n}\n.about_content > .about_contentTab > .about_content_assort > .ac_assort_news > .ac_assort_newsPages > .ac_assort_newsPages_box > .aca_news[data-v-63b2bdd0] {\n  width: 280px;\n  margin-bottom: 50px;\n}\n.about_content > .about_contentTab > .about_content_assort > .ac_assort_news > .ac_assort_newsPages > .ac_assort_newsPages_box > .aca_news > b[data-v-63b2bdd0] {\n  display: block;\n  line-height: 26px;\n  font-size: 16px;\n}\n.about_content > .about_contentTab > .about_content_assort > .ac_assort_news > .ac_assort_newsPages > .ac_assort_newsPages_box > .aca_news > h5[data-v-63b2bdd0] {\n  display: block;\n  font-size: 14px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  line-height: 40px;\n}\n.about_content > .about_contentTab > .about_content_assort > .ac_assort_news > .ac_assort_newsPages > .ac_assort_newsPages_box > .aca_news > p[data-v-63b2bdd0] {\n  font-size: 12px;\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 3;\n  overflow: hidden;\n}\n.about_content > .about_contentTab > .about_content_assort > .ac_assort_news > .ac_assort_newsPages > .ac_assort_newsPages_box > .aca_news > i[data-v-63b2bdd0] {\n  float: right;\n  cursor: pointer;\n}\n.about_content > .about_contentTab > .about_content_assort > .ac_assort_news > .ac_assort_newsText[data-v-63b2bdd0] {\n  position: relative;\n  width: 1000px;\n  margin: 0 auto;\n}\n.about_content > .about_contentTab > .about_content_assort > .ac_assort_news > .ac_assort_newsText > .ac_assort_newsText_close[data-v-63b2bdd0] {\n  position: absolute;\n  right: 150px;\n}\n.about_content > .about_contentTab > .about_content_assort > .ac_assort_news > .ac_assort_newsText > .ac_assort_newsText_close > i[data-v-63b2bdd0] {\n  display: block;\n  font-style: normal;\n  height: 30px;\n  line-height: 30px;\n  width: 30px;\n  border: 1px solid #aaa;\n  border-radius: 50%;\n  text-align: center;\n  color: #aaa;\n  cursor: pointer;\n  font-size: 20px;\n}\n.about_content > .about_contentTab > .about_content_assort > .ac_assort_news > .ac_assort_newsText > .ac_assort_newsText_close > i[data-v-63b2bdd0]:active {\n  color: #212121;\n  border: 1px solid #212121;\n}\n.about_content > .about_contentTab > .about_content_assort > .ac_assort_manager[data-v-63b2bdd0] {\n  position: relative;\n}\n.about_footer[data-v-63b2bdd0] {\n  position: relative;\n  height: 700px;\n  background-image: url(" + __webpack_require__(8) + ");\n  background-position: bottom;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n.about_footer > .about_footerBox[data-v-63b2bdd0] {\n  position: relative;\n  margin: 0 auto;\n  padding-top: 160px;\n  width: 984px;\n}\n", ""]);

// exports


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "\n*[data-v-f3b18e8c] {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: Arial, \"Microsoft YaHei\", sans-serif;\n  color: #212121;\n  word-break: break-all;\n}\n.clearfix[data-v-f3b18e8c]:after {\n  content: \"\";\n  display: block;\n  zoom: 1;\n  clear: both;\n  height: 0;\n}\n.hide[data-v-f3b18e8c] {\n  display: none;\n  visibility: hidden;\n  width: 0;\n  height: 0;\n}\nli[data-v-f3b18e8c] {\n  list-style: none;\n}\n.lr-tb[data-v-f3b18e8c] {\n  -webkit-writing-mode: horizontal-tb;\n  writing-mode: lr-tb;\n  writing-mode: horizontal-tb;\n}\n.tb-rl[data-v-f3b18e8c] {\n  -webkit-writing-mode: vertical-rl;\n  writing-mode: tb-rl;\n  writing-mode: vertical-rl;\n}\n.tb-lr[data-v-f3b18e8c] {\n  -webkit-writing-mode: vertical-lr;\n  writing-mode: tb-rl;\n  writing-mode: vertical-lr;\n}\n.con_text *[data-v-f3b18e8c] {\n  font-size: 14px;\n}\n.con_text img[data-v-f3b18e8c] {\n  display: block;\n  max-width: 490px;\n  margin: 20px auto;\n}\n.con_text p[data-v-f3b18e8c] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n}\n.con_text span[data-v-f3b18e8c] {\n  padding-bottom: 20px;\n  font-size: 14px;\n  font-weight: normal;\n  display: block;\n}\n.con_text h5[data-v-f3b18e8c] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n  font-size: 16px;\n  padding-bottom: 30px;\n}\n.con_text b[data-v-f3b18e8c] {\n  display: block;\n  width: 490px;\n  margin: 0 auto;\n  font-size: 12px;\n  font-weight: normal;\n  padding-bottom: 20px;\n}\n.con_text > .con_image[data-v-f3b18e8c] {\n  display: flex;\n  justify-content: space-around;\n  margin: 0 auto;\n}\n/* 可以设置不同的进入和离开动画 */\n/* 设置持续时间和动画函数 */\n.slide-fade-enter-active[data-v-f3b18e8c] {\n  transition: all .3s ease;\n}\n.slide-fade-leave-active[data-v-f3b18e8c] {\n  transition: all 0s cubic-bezier(1, 0.5, 0.8, 1);\n}\n.slide-fade-enter[data-v-f3b18e8c],\n.slide-fade-leave-to[data-v-f3b18e8c] {\n  transform: translateX(10px);\n  opacity: 0;\n}\n.fade-enter-active[data-v-f3b18e8c],\n.fade-leave-active[data-v-f3b18e8c] {\n  transition: opacity .5s;\n}\n.fade-enter[data-v-f3b18e8c],\n.fade-leave-to[data-v-f3b18e8c] {\n  opacity: 0;\n}\n#water[data-v-f3b18e8c] {\n  position: absolute;\n  width: calc(100% + 100px);\n  height: calc(100% + 100px);\n  background-image: url(" + __webpack_require__(4) + ");\n  background-position: bottom;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n.product_top[data-v-f3b18e8c] {\n  position: relative;\n  height: 490px;\n  background-image: url(" + __webpack_require__(29) + ");\n  background-position: bottom;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n.product_top > .product_topTab[data-v-f3b18e8c] {\n  position: relative;\n  padding-top: 32px;\n  margin: 0 auto;\n}\n.product_top > .product_topTab > .top[data-v-f3b18e8c] {\n  background: #fffaf7;\n}\n.product_assort[data-v-f3b18e8c] {\n  position: relative;\n}\n.product_assort > .product_assort_area[data-v-f3b18e8c] {\n  position: relative;\n}\n.product_assort > .product_assort_area > .product_assort_areaTab[data-v-f3b18e8c] {\n  position: relative;\n  display: flex;\n  justify-content: space-around;\n  width: 490px;\n  margin: 0 auto;\n  padding: 35px 50px;\n}\n.product_assort > .product_assort_area > .product_assort_areaTab > span[data-v-f3b18e8c] {\n  font-size: 12px;\n  cursor: pointer;\n}\n.product_assort > .product_assort_area > .product_assort_areaTab > i[data-v-f3b18e8c] {\n  line-height: 12px;\n  border: 1px solid #8EA595;\n}\n.product_assort > .product_assort_area > .product_assort_areaTab .assortTabActive[data-v-f3b18e8c] {\n  color: #8EA595;\n}\n.product_assort > .product_assort_area > .product_assort_areaDetail[data-v-f3b18e8c] {\n  position: relative;\n}\n.product_assort > .product_assort_area > .product_assort_areaDetail > .pa_areaDetail_mixednut[data-v-f3b18e8c],\n.product_assort > .product_assort_area > .product_assort_areaDetail .pa_areaDetail_partablebag[data-v-f3b18e8c],\n.product_assort > .product_assort_area > .product_assort_areaDetail .pa_areaDetail_boxed[data-v-f3b18e8c] {\n  position: relative;\n  padding-bottom: 150px;\n}\n.product_footer[data-v-f3b18e8c] {\n  position: relative;\n  height: 700px;\n  background-image: url(" + __webpack_require__(8) + ");\n  background-position: bottom;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n.product_footer > .product_footerBox[data-v-f3b18e8c] {\n  position: relative;\n  margin: 0 auto;\n  padding-top: 160px;\n  width: 984px;\n}\n", ""]);

// exports


/***/ }),
/* 19 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = "./../images/02mixednuts-1.png";

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "./../images/03address-1.png";

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "./../images/03figure-1.png";

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "./../images/04news-1.png";

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "./../images/06Bagged-1.png";

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v2.5.0
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (process.env.NODE_ENV !== 'production') {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
    process.env.NODE_ENV !== 'production' &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (process.env.NODE_ENV !== 'production') {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (process.env.NODE_ENV !== 'production') {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (process.env.NODE_ENV !== 'production' && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (process.env.NODE_ENV !== 'production' && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (process.env.NODE_ENV !== 'production') {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if (process.env.NODE_ENV !== 'production' && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '2.5.0',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(19)))

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(96)

/* script */
__vue_exports__ = __webpack_require__(72)

/* template */
var __vue_template__ = __webpack_require__(88)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "E:\\0_new_study\\00_2018study\\0_geodeer_git\\src\\compparent\\index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-24430846"

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-24430846", __vue_options__)
  } else {
    hotAPI.reload("data-v-24430846", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] index.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = "./../images/01Firstpicture.png";

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = "./../images/01lianxiwomen.png";

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = "./../images/02erweima.png";

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = "./../images/02introduction.png";

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = "./../images/02phone-1.png";

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = "./../images/02phone.png";

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = "./../images/03culture.png";

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = "./../images/03figure-2.png";

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = "./../images/04email-1.png";

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = "./../images/04email.png";

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = "./../images/04figure-2.png";

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = "./../images/05figure-3.png";

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = "./../images/05web-1.png";

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = "./../images/05web.png";

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = "./../images/06Bagged-2.png";

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = "./../images/06Bagged-3.png";

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = "./../images/06deer.png";

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = "./../images/08box.png";

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = "./../images/09nut-3.png";

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = "./../images/10nut-4.png";

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG0AAABvCAYAAADmME5dAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABWZJREFUeNrsnf112jAUxYUXgEyAOwHeAHeCuhPEnSCM4G7ACGSCOhPUnaAwQckGZAKqF55zHMAgWx+W4N5zdMgfHGK9n68+nmR5tN/vRagajUYT+ZHIkspS/02aK/7ERpadLJUsW1nWMh5r7+sdEjSGRIAyBjSz8G/eGGJJnzI+W0DrBytnUN8G+PfkxhUVGasdoF0GFcsPgrWQZezJZT0zvGrQqyBoPhXum5Z0aR4XgpYOFSOvnCbdlXFTNBZh6IVaAtf9XuTLAEMW6vh/BQRMcB+7lte+uKs+TVY4YXfNRNgi1+UuBiuDQmNgVWDuujbSzG3P9QaDdoPAmvO81Ca4CMCMi+pUcR1vw2k3DuzYcbGNPi5yDGzC6aFbB/bhuFtoHgnYVNyPZvJGXQYLTV58IdSz77ekJ1n3NLg+jfuxv+J+tZFxTkJz2krct2a8UhEGNG4WZwIqgoDGo8UFeL1raspttp22vJPhvVO3WRuI8CLmP3A60XcZ89JXpxXgc1aZl07jvmyLprFVDzrpLVtOywHMnttsQcOI0SI0480jsh9qknEf+eS0HEiUbu7MJ2gpkNiNU2T47qFRI1JWIUGDyzppxjf54NASsLB/kwMaoIkJOIQHDerYr/kAbQ4OnUfc6WDQXD+EcEPqPA4wlsaS0ChrjSRxd3Xe1BoZtDiA9RPFrRiiecSkWk9PvNIPaIGpcA0N0lemmtbShsb9GYb6Zvq2zJXTCsTbmFLr0HiVGi4zp9iF03LE2ajmLqAhqz+AIhd3BqSsPxjyh6fSBbQN4hwetDXibEyvqmds9YbG+/YyxNqYpqpnj0Q9gdGEOrTDx0LQSulbPc5jpB/eo1grxVUGHQ/PLBFUJyXRPqSTs8+VwO5hZ/M1ySXV7dNKAHObzrr4UD36MG8L7RmZnGMSKYwSH3HjD6LWvSOtfRrPw34hdoPry/GkO2oBFgscjeSLCiWnSWg0UkQG31O3RWeA5QDmt9s+OQ3nf4ThtmOnLQDMWy1OnAaXea83yWpy7LQcwPyet9VZkuic/SBvlX00j7xL+Ddi4r/opJ+oSRDyX5SpArTwlEacspoiFsEoIaeliENQmhM0bO0OTIAWKLQYYQhsBCkOS9tQYE6DAA3yCRo9O/UTIQurT/sqDtu6cBK4HZEplHcMqOzBKxv7ILcCexKN73HsGNurX/y0aVIc1t0QaAsPXSjG9v2ZwPIKsOTMgxg7BNpoiRvxra58d3mJ7gmwxg8XCLSxsjqKbXINcJtzqib9lsee4DYzJe1giurj+TR2G7WVq3M/0gIOfZt+qTo8+LKrjdT5SdCjH64QeLMuO4rvkmNcNrsqreNw8QYnLT3L2OfO01jyn66RJemlN6Fxep+Rg6fxwEZn/ZBxXw0NDbuTHTSLRrP8fDx5yraH2kXHUmlvCja2NMP9G8BdBpbqvHXXOLQGOJqxv4DRiSoTwIxD4z2UGU/UcULdZ9HZ+1WX8/cvuUN3gh1zdgQT7Q75xktpQmPHLCGV5Q88AAvkEDNtaArLByiaSzSXSt+BCB5ANK9H1XfQ9cqI4F1p9nKS9XPVNob8AGZHY5XXTWKzqn+6Oo/r2zxi/789PVzLnPR1GrIddvSikurqC61AfI1rIxRfuNR7PU02kTSb9/UAT1ppoIz6mnN9dT8x4dxo5tlgqtsKgIE0lm9b6SqV1BAnCApObg955G3hNPfY2ANZeACPgp9r1CHnXODW0bXSRHrS53qNvZycm8y66aG5hotjLl7FYXvZitfyTNUj5jokjTLWbP7WXErVd8oY79MUK15XuO5XdCr/yi6o6k/dyveoUz3xTdidbar4c2fyZqr1X4ABABX0U4t+b9DPAAAAAElFTkSuQmCC"

/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = "./../images/map.png";

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAbCAYAAABiFp9rAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZ9JREFUeNq8lo1tgzAQhQ0LpBskmSDZoN6gbFC6gUcgGzBCsgHZwNmATBCyAZ2A3qHnykL+wYH2pBMIbH/23fPZ2TAMwmfb/X5HD3aJTy1593w8WpFomQtEgJIeivzg6fdNXrMTtE8GYQVn8nfyJwZraTCN/0d6sJdow0BF/8+zQRhE43tFnetQR2ovMakt+VcMNoKo0xvHHt/k3Bygn0aIg7AcT26wSYGwIT+8sjuHGaF3gxCyD/LTK2oCTGGiVWhFCu+1eNEglht5EQLxiq5zZRqwMfwQiRN0wEZcakaxu5AYFhtFpPsXkKW43ge6+WaRaEerHjpBXUgtCVbEQBXUohaG7ZP84lNvjiRy+KrQzp4hbRHbsALVmK1B/UpZjan2J0t5bhAalGZPoSxFw0XeIGQiJqjpecSABqX/wu80icZxPBSY2GYyHueonHXCInTKKpS/exITMHa1cqKttk5YFrkzSOu+YIzDrO18WIemFxYEJYpiChuruZH7aiAP7I7DtF8VFIKtDvLlLBd/YLgSSFzHxOo58t10+aj/EWAAZZDQ5NP85zQAAAAASUVORK5CYII="

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(97)

/* script */
__vue_exports__ = __webpack_require__(67)

/* template */
var __vue_template__ = __webpack_require__(89)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "E:\\0_new_study\\00_2018study\\0_geodeer_git\\src\\compchild\\manager.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-31208b80"

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-31208b80", __vue_options__)
  } else {
    hotAPI.reload("data-v-31208b80", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] manager.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


window.managerTimer = null;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = __webpack_require__(28);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 1. 定义（路由）组件。
// 可以从其他文件 import 进来
var Home = __webpack_require__(85);
var About = __webpack_require__(83);
var Product = __webpack_require__(86);
var Contact = __webpack_require__(84);

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
var routes = [{ path: '/', component: Home },
// {
//     path: '/foo',
//     component: Foo ,
//     children: [
//         {
//             path: 'bbb',
//             component: Bbb,
//         }
//     ]
// },
{ path: '/about', component: About }, { path: '/product', component: Product }, { path: '/contact', component: Contact }];

exports.default = {
    routes: routes
};

// export default [{
//     path: '/',
//     component: App,
//     children: [],
//     // routes: routes,
// }];

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vue = __webpack_require__(1);

var _vue2 = _interopRequireDefault(_vue);

var _vuex = __webpack_require__(27);

var _vuex2 = _interopRequireDefault(_vuex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vuex2.default);

var state = {
    tabType: "HOME"
};

var mutations = {
    setId: function setId(state, aaa) {},
    setTabType: function setTabType(state, tabType) {
        state.tabType = tabType;
    }
};

var actions = {};

exports.default = new _vuex2.default.Store({
    state: state,
    actions: actions,
    mutations: mutations
});

/***/ }),
/* 63 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = "./../images/logo.ico";

/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process) {/**
  * vue-router v2.8.1
  * (c) 2017 Evan You
  * @license MIT
  */
/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
}

function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val;
      }
    }

    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    var propsToPass = data.props = resolveProps(route, matched.props && matched.props[name]);
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend({}, propsToPass);
      // pass non-declared props as attrs
      var attrs = data.attrs = data.attrs || {};
      for (var key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key];
          delete propsToPass[key];
        }
      }
    }

    return h(component, data, children)
  }
};

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
  }
}

function extend (to, from) {
  for (var key in from) {
    to[key] = from[key];
  }
  return to
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    process.env.NODE_ENV !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    parsedQuery[key] = extraQuery[key];
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */


var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;

  var query = location.query || {};
  try {
    query = clone(query);
  } catch (e) {}

  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route)
}

function clone (value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (value && typeof value === 'object') {
    var res = {};
    for (var key in value) {
      res[key] = clone(value[key]);
    }
    return res
  } else {
    return value
  }
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  // handle null value #1566
  if (!a || !b) { return a === b }
  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) {
    var aVal = a[key];
    var bVal = b[key];
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal)
    }
    return String(aVal) === String(bVal)
  })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null
            ? 'router-link-active'
            : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null
            ? 'router-link-exact-active'
            : globalExactActiveClass;
    var activeClass = this.activeClass == null
            ? activeClassFallback
            : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null
            ? exactActiveClassFallback
            : this.exactActiveClass;
    var compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) { on[e] = handler; });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var extend = _Vue.util.extend;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
};

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  _Vue = Vue;

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });

  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

var isarray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

/*  */

// $flow-disable-line
var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = pathToRegexp_1.compile(path));
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
    return ''
  }
}

/*  */

function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  // $flow-disable-line
  var pathMap = oldPathMap || Object.create(null);
  // $flow-disable-line
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  if (process.env.NODE_ENV !== 'production') {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

  var pathToRegexpOptions = route.pathToRegexpOptions || {};
  var normalizedPath = normalizePath(
    path,
    parent,
    pathToRegexpOptions.strict
  );

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (process.env.NODE_ENV !== 'production') {
      if (route.name && !route.redirect && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias)
      ? route.alias
      : [route.alias];

    aliases.forEach(function (alias) {
      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      );
    });
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function compileRouteRegex (path, pathToRegexpOptions) {
  var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
  if (process.env.NODE_ENV !== 'production') {
    var keys = Object.create(null);
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
      keys[key.name] = true;
    });
  }
  return regex
}

function normalizePath (path, parent, strict) {
  if (!strict) { path = path.replace(/\/$/, ''); }
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */


function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = assign({}, next);
    next._normalized = true;
    var params = assign(assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else if (process.env.NODE_ENV !== 'production') {
      warn(false, "relative params navigation requires a current route.");
    }
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

function assign (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

/*  */


function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      if (!record) { return _createRoute(null, location) }
      var paramNames = record.regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  regex,
  path,
  params
) {
  var m = path.match(regex);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      params[key.name] = val;
    }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */


var positionStore = Object.create(null);

function setupScroll () {
  // Fix for #1585 for Firefox
  window.history.replaceState({ key: getStateKey() }, '');
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior(to, from, isPop ? position : null);

    if (!shouldScroll) {
      return
    }

    if (typeof shouldScroll.then === 'function') {
      shouldScroll.then(function (shouldScroll) {
        scrollToPosition((shouldScroll), position);
      }).catch(function (err) {
        if (process.env.NODE_ENV !== 'production') {
          assert(false, err.toString());
        }
      });
    } else {
      scrollToPosition(shouldScroll, position);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el, offset) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function normalizeOffset (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

function scrollToPosition (shouldScroll, position) {
  var isObject = typeof shouldScroll === 'object';
  if (isObject && typeof shouldScroll.selector === 'string') {
    var el = document.querySelector(shouldScroll.selector);
    if (el) {
      var offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {};
      offset = normalizeOffset(offset);
      position = getElementPosition(el, offset);
    } else if (isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }
  } else if (isObject && isValidPosition(shouldScroll)) {
    position = normalizePosition(shouldScroll);
  }

  if (position) {
    window.scrollTo(position.x, position.y);
  }
}

/*  */

var supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date;

var _key = genKey();

function genKey () {
  return Time.now().toFixed(3)
}

function getStateKey () {
  return _key
}

function setStateKey (key) {
  _key = key;
}

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default;
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          process.env.NODE_ENV !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

var hasSymbol =
  typeof Symbol === 'function' &&
  typeof Symbol.toStringTag === 'symbol';

function isESModule (obj) {
  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (called) { return }
    called = true;
    return fn.apply(this, args)
  }
}

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) { cb(err); });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (instances[key]) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

/*  */


var HTML5History = (function (History$$1) {
  function HTML5History (router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;

    if (expectScroll) {
      setupScroll();
    }

    var initLocation = getLocation(this.base);
    window.addEventListener('popstate', function (e) {
      var current = this$1.current;

      // Avoiding first `popstate` event dispatched in some browsers but first
      // history route not updated since async guard at the same time.
      var location = getLocation(this$1.base);
      if (this$1.current === START && location === initLocation) {
        return
      }

      this$1.transitionTo(location, function (route) {
        if (expectScroll) {
          handleScroll(router, route, current, true);
        }
      });
    });
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = window.location.pathname;
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */


var HashHistory = (function (History$$1) {
  function HashHistory (router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    var router = this.router;
    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      setupScroll();
    }

    window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', function () {
      var current = this$1.current;
      if (!ensureSlash()) {
        return
      }
      this$1.transitionTo(getHash(), function (route) {
        if (supportsScroll) {
          handleScroll(this$1.router, route, current, true);
        }
        if (!supportsPushState) {
          replaceHash(route.fullPath);
        }
      });
    });
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(
      cleanPath(base + '/#' + location)
    );
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : href.slice(index + 1)
}

function getUrl (path) {
  var href = window.location.href;
  var i = href.indexOf('#');
  var base = i >= 0 ? href.slice(0, i) : href;
  return (base + "#" + path)
}

function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path));
  } else {
    window.location.hash = path;
  }
}

function replaceHash (path) {
  if (supportsPushState) {
    replaceState(getUrl(path));
  } else {
    window.location.replace(getUrl(path));
  }
}

/*  */


var AbstractHistory = (function (History$$1) {
  function AbstractHistory (router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History$$1 ) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */

var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, ("invalid mode: " + mode));
      }
  }
};

var prototypeAccessors = { currentRoute: { configurable: true } };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  process.env.NODE_ENV !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
  return registerHook(this.resolveHooks, fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  return registerHook(this.afterHooks, fn)
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? to.matched
      ? to
      : this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  var location = normalizeLocation(
    to,
    current || this.history.current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '2.8.1';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ __webpack_exports__["default"] = (VueRouter);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(19)))

/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function($) {//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {};
    },

    methods: {
        returnToTop: function returnToTop() {
            $("body").scrollTop(0);
        }
    }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function($) {//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            managerTimer: null
        };
    },
    mounted: function mounted() {
        if (this.managerTimer) {
            clearInterval(this.managerTimer);
        }
        this.managerTimer = setInterval(function () {
            // console.log("managerTimer");
            $(".manager_control>span:eq(1)").trigger("click");
        }, 10000);
    },
    destroyed: function destroyed() {
        if (this.managerTimer) {
            clearInterval(this.managerTimer);
        }
    },

    methods: {
        clickToPrevious: function clickToPrevious() {
            var oldActiveEl = $(".mg_slide_active");
            var zIndex = $(oldActiveEl).css("z-index");
            var preAll = $(oldActiveEl).prevAll();
            var nextAll = $(oldActiveEl).nextAll();
            if (preAll && preAll.length > 0) {
                var preEl = $(oldActiveEl).prev();
                var listAll = $(".manager_info_box>ul>li");
                listAll.each(function (index, item) {
                    $(item).removeClass("mg_slide_active");
                    $(item).removeClass("mg_slide_preActive");
                    $(item).removeClass("mg_slide_nextActive");
                });
                $(preEl).addClass("mg_slide_active");
                $(preEl).addClass("mg_slide_preActive");
                $(preEl).css("z-index", parseInt(zIndex) + 1);
            } else if (nextAll && nextAll.length > 0) {
                var lastEl = $(".manager_info_box>ul>li").last();
                var listAll = $(".manager_info_box>ul>li");
                listAll.each(function (index, item) {
                    $(item).removeClass("mg_slide_active");
                    $(item).removeClass("mg_slide_preActive");
                    $(item).removeClass("mg_slide_nextActive");
                });
                $(lastEl).addClass("mg_slide_active");
                $(lastEl).addClass("mg_slide_preActive");
                $(lastEl).css("z-index", parseInt(zIndex) + 1);
            }
        },
        clickToNext: function clickToNext() {
            var oldActiveEl = $(".mg_slide_active");
            var zIndex = $(oldActiveEl).css("z-index");
            var preAll = $(oldActiveEl).prevAll();
            var nextAll = $(oldActiveEl).nextAll();
            if (nextAll && nextAll.length > 0) {
                var nextEl = $(oldActiveEl).next();
                var listAll = $(".manager_info_box>ul>li");
                listAll.each(function (index, item) {
                    $(item).removeClass("mg_slide_active");
                    $(item).removeClass("mg_slide_preActive");
                    $(item).removeClass("mg_slide_nextActive");
                });
                $(nextEl).addClass("mg_slide_active");
                $(nextEl).addClass("mg_slide_nextActive");
                $(nextEl).css("z-index", parseInt(zIndex) + 1);
            } else if (preAll && preAll.length > 0) {
                var firstEl = $(".manager_info_box>ul>li").first();
                var listAll = $(".manager_info_box>ul>li");
                listAll.each(function (index, item) {
                    $(item).removeClass("mg_slide_active");
                    $(item).removeClass("mg_slide_preActive");
                    $(item).removeClass("mg_slide_nextActive");
                });
                $(firstEl).addClass("mg_slide_active");
                $(firstEl).addClass("mg_slide_nextActive");
                $(firstEl).css("z-index", parseInt(zIndex) + 1);
            }
        }
    }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(27);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            logo: __webpack_require__(20),
            otherFigurePic: __webpack_require__(39)
            // tabType: "HOME",
        };
    },

    computed: _extends({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_vuex__["mapState"])(['tabType'])),
    mounted: function mounted() {
        var that = this;
    },

    methods: {
        clickTab: function clickTab(strTab) {
            this.$store.commit('setTabType', strTab);
        }
    }
});

/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compchild_top_vue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compchild_top_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__compchild_top_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compchild_footer_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compchild_footer_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__compchild_footer_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__compchild_manager_vue__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__compchild_manager_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__compchild_manager_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            contentAssort: 'BRIEF',
            bIsNewsDetailShow: false
        };
    },
    mounted: function mounted() {
        var that = this;
        this.$store.commit('setTabType', "ABOUT");
    },

    methods: {
        clickShowACAssort: function clickShowACAssort(eClick, strAssort) {
            var that = this;
            var el = eClick.currentTarget;
            this.contentAssort = strAssort;

            $(el).addClass("contentTabActive");
            $(el).siblings().removeClass("contentTabActive");
        },
        clickCloseNewsText: function clickCloseNewsText() {
            this.bIsNewsDetailShow = false;
        },
        clickShowNewsText: function clickShowNewsText() {
            this.bIsNewsDetailShow = true;
        }
    },
    components: {
        "Top": __WEBPACK_IMPORTED_MODULE_0__compchild_top_vue___default.a,
        "Foot": __WEBPACK_IMPORTED_MODULE_1__compchild_footer_vue___default.a,
        "Manager": __WEBPACK_IMPORTED_MODULE_2__compchild_manager_vue___default.a
    }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compchild_top_vue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compchild_top_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__compchild_top_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compchild_footer_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compchild_footer_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__compchild_footer_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            assortTab: 'FEEDBACK',
            assortContactTab: 'ADDRESS',
            bIsShowRecruitDetail: false
        };
    },
    mounted: function mounted() {
        var that = this;
        this.$store.commit('setTabType', "CONTACT");

        // this.initMap();
    },

    methods: {
        clickShowContactAssort: function clickShowContactAssort(eClick, strTab) {
            var that = this;
            var el = eClick.currentTarget;
            this.assortTab = strTab;

            $(el).addClass("assortTabActive");
            $(el).siblings().removeClass("assortTabActive");
        },
        clickContactTab: function clickContactTab(eClick, strTab) {
            var that = this;
            var el = eClick.currentTarget;
            this.assortContactTab = strTab;

            var dataKey = $(el).find("img").attr("data-key");
            var src = __webpack_require__(103)("./" + dataKey + "-1.png");
            $(el).find("img").attr("src", src);

            var elSiblings = $(el).siblings();
            elSiblings.each(function (index, item) {
                var itemDataKey = $(item).find("img").attr("data-key");
                var preSrc = __webpack_require__(104)("./" + itemDataKey + ".png");
                $(item).find("img").attr("src", preSrc);
            });
        },
        clickToShowRecruit: function clickToShowRecruit(obj) {
            var that = this;

            this.bIsShowRecruitDetail = true;
        },
        clickToCloseShowRecruit: function clickToCloseShowRecruit() {
            var that = this;

            this.bIsShowRecruitDetail = false;
        },
        initMap: function initMap() {
            var map = new qq.maps.Map(document.getElementById("container"), {
                center: new qq.maps.LatLng(39.916527, 116.397128), // 地图的中心地理坐标。
                zoom: 8 // 地图的中心地理坐标。
            });
        },
        goToMap: function goToMap(e) {
            if (e.currentTarget == e.target) {
                window.location.href = 'http://map.qq.com/';
            }
        }
    },
    components: {
        "Top": __WEBPACK_IMPORTED_MODULE_0__compchild_top_vue___default.a,
        "Foot": __WEBPACK_IMPORTED_MODULE_1__compchild_footer_vue___default.a
    }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compchild_top_vue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compchild_top_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__compchild_top_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compchild_footer_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compchild_footer_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__compchild_footer_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__compchild_manager_vue__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__compchild_manager_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__compchild_manager_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vuex__ = __webpack_require__(27);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            waterTimer: null
        };
    },
    mounted: function mounted() {
        var that = this;
        this.$store.commit('setTabType', "HOME");

        this.refrashShadowHeight();

        $(document).ready(function () {
            // console.log("ready");

            // absolute  忽略 父子元素的 相对位置，子元素位置为 （0， 0）
            var el = document.getElementById('water'); // 目标
            var startPosition = { left: -50, top: -50 }; // TODO: 设置初始位置
            var speed = { vx: -1, vy: 1 }; // 初始速度
            var a = 1; // 加速度
            var interval = { minLeft: -100, maxLeft: 0, minTop: -100, maxTop: 0 }; // 区间

            var move = function move() {
                // console.log(a);

                var position = { // 位置
                    left: $(el).position().left,
                    top: $(el).position().top
                };

                position = {
                    left: position.left + speed.vx,
                    top: position.top + speed.vy
                };

                var absPos = { left: Math.abs(startPosition.left), top: Math.abs(startPosition.top) };
                if (position.left <= interval.minLeft) {
                    position.left = interval.minLeft;

                    a = parseInt(Math.random() * 40 + 80) / 100;
                    speed.vx *= -a;

                    a = parseInt(Math.random() * 40 + 80) / 100;
                    speed.vy *= a;
                }
                if (position.left > interval.minLeft && position.left < interval.maxLeft) {
                    // do nothing
                }
                if (position.left >= interval.maxLeft) {
                    position.left = interval.maxLeft;

                    a = parseInt(Math.random() * 40 + 80) / 100;
                    speed.vx *= -a;

                    a = parseInt(Math.random() * 40 + 80) / 100;
                    speed.vy *= a;
                }

                if (position.top <= interval.minTop) {
                    position.top = interval.minTop;

                    a = parseInt(Math.random() * 40 + 80) / 100;
                    speed.vx *= a;

                    a = parseInt(Math.random() * 40 + 80) / 100;
                    speed.vy *= -a;
                }
                if (position.top > interval.minTop && position.top < interval.maxTop) {
                    // do nothing
                }
                if (position.top >= interval.maxTop) {
                    position.top = interval.maxTop;

                    a = parseInt(Math.random() * 40 + 80) / 100;
                    speed.vx *= a;

                    a = parseInt(Math.random() * 40 + 80) / 100;
                    speed.vy *= -a;
                }

                $(el).css({ "left": position.left + "px", "top": position.top + "px" });
            };

            that.waterTimer = setInterval(function () {
                move();
            }, 100);
        });
    },
    destroyed: function destroyed() {
        // console.log("destroyed");

        if (this.waterTimer) {
            clearInterval(this.waterTimer);
        }
    },

    computed: {},
    methods: {
        clickFindMore: function clickFindMore() {
            $("body").scrollTop(0);
        },
        refrashShadowHeight: function refrashShadowHeight() {
            var that = this;
            var showList = $(".hc_product_cShow");
            showList.each(function (index, el) {
                var elH = $(el).find(".shadow_text").css("height");
                $(el).find(".shadow_lineTop").css("height", "calc( 50% - " + (parseInt(elH) / 2 + 6 + 50) + "px)");
                $(el).find(".shadow_lineBottom").css("height", "calc( 50% - " + (parseInt(elH) / 2 + 50) + "px)");
            });

            showList.each(function (index, el) {
                var elPic = $(el).find(".light_pic").css("height");
                var elAdvert = $(el).find(".light_advert").css("height");
                $(el).find(".light_line").css("height", "calc( 100% - " + (parseInt(elPic) + parseInt(elAdvert) + 30) + "px)");
            });

            showList.each(function (index, el) {
                var elPic = $(el).find(".weight_pic").css("height");
                var elAdvert = $(el).find(".weight_advert").css("height");
                $(el).find(".weight_line").css("height", "calc( 100% - " + (parseInt(elPic) + parseInt(elAdvert) + 30) + "px)");
            });
        }
    },
    watch: {
        // deep: true,
    },
    components: {
        "Top": __WEBPACK_IMPORTED_MODULE_0__compchild_top_vue___default.a,
        "Foot": __WEBPACK_IMPORTED_MODULE_1__compchild_footer_vue___default.a,
        "Manager": __WEBPACK_IMPORTED_MODULE_2__compchild_manager_vue___default.a
    }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {};
    },
    mounted: function mounted() {
        // console.log('aaa');
        // console.log($(".main"));
    }
});

/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compchild_top_vue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compchild_top_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__compchild_top_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compchild_footer_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compchild_footer_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__compchild_footer_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            assortTab: 'MIXEDNUT'
        };
    },
    mounted: function mounted() {
        var that = this;
        this.$store.commit('setTabType', "PRODUCT");
    },

    methods: {
        clickShowProAssort: function clickShowProAssort(eClick, strTab) {
            var that = this;
            var el = eClick.currentTarget;
            this.assortTab = strTab;

            $(el).addClass("assortTabActive");
            $(el).siblings().removeClass("assortTabActive");
        }
    },
    components: {
        "Top": __WEBPACK_IMPORTED_MODULE_0__compchild_top_vue___default.a,
        "Foot": __WEBPACK_IMPORTED_MODULE_1__compchild_footer_vue___default.a
    }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vue = __webpack_require__(1);

var _vue2 = _interopRequireDefault(_vue);

var _vueRouter = __webpack_require__(65);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _jquery = __webpack_require__(6);

var _jquery2 = _interopRequireDefault(_jquery);

var _index = __webpack_require__(62);

var _index2 = _interopRequireDefault(_index);

var _index3 = __webpack_require__(61);

var _index4 = _interopRequireDefault(_index3);

var _index5 = __webpack_require__(28);

var _index6 = _interopRequireDefault(_index5);

var _index7 = __webpack_require__(63);

var _index8 = _interopRequireDefault(_index7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Vue.use(VueResource);
_vue2.default.use(_vueRouter2.default);
// import VueResource from 'vue-resource';

__webpack_require__(60);
__webpack_require__(64);
// require('../../lib/qqmap');

// console.log(routers);

var router = new _vueRouter2.default(_index4.default);

var vm = new _vue2.default({
    el: '#app',
    store: _index2.default,
    router: router,
    data: {},
    render: function render(z) {
        return z(_index6.default);
    }
});

/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = "./../images/01Firstpicture.jpg";

/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports = "./../images/03address.png";

/***/ }),
/* 77 */
/***/ (function(module, exports) {

module.exports = "./../images/07nut-1.jpg";

/***/ }),
/* 78 */
/***/ (function(module, exports) {

module.exports = "./../images/08nut-2.jpg";

/***/ }),
/* 79 */
/***/ (function(module, exports) {

module.exports = "./../images/11nut-5.jpg";

/***/ }),
/* 80 */
/***/ (function(module, exports) {

module.exports = "./../images/12leader.jpg";

/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = "./../images/13leader.jpg";

/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = "./../images/14leader.jpg";

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(101)

/* script */
__vue_exports__ = __webpack_require__(69)

/* template */
var __vue_template__ = __webpack_require__(93)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "E:\\0_new_study\\00_2018study\\0_geodeer_git\\src\\compparent\\about.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-63b2bdd0"

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-63b2bdd0", __vue_options__)
  } else {
    hotAPI.reload("data-v-63b2bdd0", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] about.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(98)

/* script */
__vue_exports__ = __webpack_require__(70)

/* template */
var __vue_template__ = __webpack_require__(90)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "E:\\0_new_study\\00_2018study\\0_geodeer_git\\src\\compparent\\contact.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-3d00e12a"

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3d00e12a", __vue_options__)
  } else {
    hotAPI.reload("data-v-3d00e12a", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] contact.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(100)

/* script */
__vue_exports__ = __webpack_require__(71)

/* template */
var __vue_template__ = __webpack_require__(92)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "E:\\0_new_study\\00_2018study\\0_geodeer_git\\src\\compparent\\home.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-592f67b8"

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-592f67b8", __vue_options__)
  } else {
    hotAPI.reload("data-v-592f67b8", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] home.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(102)

/* script */
__vue_exports__ = __webpack_require__(73)

/* template */
var __vue_template__ = __webpack_require__(94)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "E:\\0_new_study\\00_2018study\\0_geodeer_git\\src\\compparent\\product.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-f3b18e8c"

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f3b18e8c", __vue_options__)
  } else {
    hotAPI.reload("data-v-f3b18e8c", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] product.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _h('div', {
    staticClass: "footer"
  }, [_h('div', {
    staticClass: "footer_box"
  }, [_h('div', {
    staticClass: "footer_content clearfix"
  }, [_vm._m(0), " ", _h('div', {
    staticClass: "footer_about"
  }, [_h('router-link', {
    attrs: {
      "tag": "h5",
      "to": "/about"
    }
  }, ["关于迷鹿"]), " ", _vm._m(1)]), " ", _h('div', {
    staticClass: "footer_product"
  }, [_h('router-link', {
    attrs: {
      "tag": "h5",
      "to": "/product"
    }
  }, ["迷鹿产品"]), " ", _vm._m(2)]), " ", _h('div', {
    staticClass: "footer_contact"
  }, [_h('router-link', {
    attrs: {
      "tag": "h5",
      "to": "/contact"
    }
  }, ["联系我们"]), " ", _vm._m(3)])]), " ", _h('hr'), " ", _vm._m(4)])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _h('div', {
    staticClass: "footer_logo"
  }, [_h('img', {
    attrs: {
      "src": __webpack_require__(20),
      "alt": ""
    }
  }), " ", _h('img', {
    attrs: {
      "src": __webpack_require__(36),
      "alt": ""
    }
  })])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _h('ul', [_h('li', ["企业介绍"]), " ", _h('li', ["企业文化"]), " ", _h('li', ["迷鹿新闻"]), " ", _h('li', ["团队精英"])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _h('ul', [_h('li', ["混合坚果系列"]), " ", _h('li', ["便携袋装系列"]), " ", _h('li', ["畅想盒装系列"])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _h('ul', [_h('li', ["信息反馈"]), " ", _h('li', ["联系方式"]), " ", _h('li', ["招聘信息"])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _h('div', {
    staticClass: "footer_concat"
  }, [_h('div', {
    staticClass: "footer_wqw"
  }, [_h('span', [_h('img', {
    attrs: {
      "src": __webpack_require__(55),
      "alt": ""
    }
  })]), " ", _h('span', [_h('img', {
    attrs: {
      "src": __webpack_require__(54),
      "alt": ""
    }
  })]), " ", _h('span', [_h('img', {
    attrs: {
      "src": __webpack_require__(56),
      "alt": ""
    }
  })])]), " ", _h('div', {
    staticClass: "footer_comp"
  }, [_h('p', ["吉林省迷鹿几何食品有限公司  /GEODEER Food Co., Ltd."])])])
}]}
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-097150d0", module.exports)
  }
}

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _h('div', {
    staticClass: "main"
  }, [_h('router-view')])
},staticRenderFns: []}
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-24430846", module.exports)
  }
}

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _h('div', {
    staticClass: "manager"
  }, [_h('div', {
    staticClass: "manager_area"
  }, [_vm._m(0), " ", _h('div', {
    staticClass: "manager_control"
  }, [_h('span', {
    on: {
      "click": _vm.clickToPrevious
    }
  }, ["<"]), " ", _h('span', {
    on: {
      "click": _vm.clickToNext
    }
  }, [">"]), " ", " "])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _h('div', {
    staticClass: "manager_info_box"
  }, [_h('ul', [_h('li', {
    staticClass: "mg_slide_active",
    staticStyle: {
      "": "#444",
      "z-index": "3"
    }
  }, [_h('div', {
    staticClass: "manager_info_pic"
  }, [_h('img', {
    attrs: {
      "src": __webpack_require__(80),
      "alt": ""
    }
  }), " ", _h('p', [_h('span', ["李金玲"]), _h('br'), _h('b', ["General manager"])])]), " ", _h('div', {
    staticClass: "manager_info_text"
  }, [_h('p', ["\n                            迷鹿的使命是关注现代职业女性的精神生活状态，我们期望帮助千万女性舒缓压抑状态。", _h('br'), "\n                            迷鹿的愿景是成为持续为顾客、合作伙伴、员工创造新价值的公司；", _h('br'), "\n                            成为一家透明、简单、信任的公司；成为一个让员工有安全感、幸福感的大家庭。\n                        "])])]), " ", _h('li', {
    staticStyle: {
      "": "#444",
      "z-index": "1"
    }
  }, [_h('div', {
    staticClass: "manager_info_pic"
  }, [_h('img', {
    attrs: {
      "src": __webpack_require__(81),
      "alt": ""
    }
  }), " ", _h('p', [_h('span', ["李程思"]), _h('br'), _h('b', ["copartner"])])]), " ", _h('div', {
    staticClass: "manager_info_text"
  }, [_h('p', ["\n                            现在，我们不在是单一的食品企业，却也在提醒着我们，市场在变化，我们要不断的进步；", _h('br'), "\n                            客户需求在改变，是对我们提出了更高的要求。而我们只有以优质的产品与诚挚的服务来迎接未来的每一个客户，我们在成长，我们在进步，我们一直在路上......\n                        "])])]), " ", _h('li', {
    staticStyle: {
      "": "#444",
      "z-index": "2"
    }
  }, [_h('div', {
    staticClass: "manager_info_pic"
  }, [_h('img', {
    attrs: {
      "src": __webpack_require__(82),
      "alt": ""
    }
  }), " ", _h('p', [_h('span', ["赵永兰"]), _h('br'), _h('b', ["General manager"])])]), " ", _h('div', {
    staticClass: "manager_info_text"
  }, [_h('p', ["\n                            因为有梦想，才会有充满激情的事业，迷鹿几何环绕愿景、使命、价值观的管理理念来引领企业进步。迷鹿是每个员工实现梦想的舞台。这些年来，公司的业绩成年翻倍增长，员工的收入及待遇也每年提高，公司在高速发展中走向未来......\n                        "])])])])])
}]}
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-31208b80", module.exports)
  }
}

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _h('transition', {
    attrs: {
      "name": "fade"
    }
  }, [_h('div', {
    staticClass: "contact"
  }, [_h('div', {
    staticClass: "contact_top",
    on: {
      "click": function($event) {
        _vm.goToMap($event)
      }
    }
  }, [_h('div', {
    staticClass: "contact_topTab"
  }, [_h('Top')])]), " ", _h('div', {
    staticClass: "contact_assort"
  }, [_h('div', {
    staticClass: "contact_assort_area"
  }, [_h('div', {
    staticClass: "contact_assort_areaTab"
  }, [_h('span', {
    staticClass: "assortTabActive",
    on: {
      "click": function($event) {
        _vm.clickShowContactAssort($event, "FEEDBACK")
      }
    }
  }, ["信息反馈"]), " ", _h('i'), " ", _h('span', {
    on: {
      "click": function($event) {
        _vm.clickShowContactAssort($event, "CONTACT")
      }
    }
  }, ["联系方式"]), " ", _h('i'), " ", _h('span', {
    on: {
      "click": function($event) {
        _vm.clickShowContactAssort($event, "RECRUIT")
      }
    }
  }, ["招聘信息"])]), " ", _h('div', {
    staticClass: "contact_assort_areaDetail"
  }, [_h('transition', {
    attrs: {
      "name": "slide-fade"
    }
  }, [_h('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.assortTab == "FEEDBACK"),
      expression: "assortTab==\"FEEDBACK\""
    }],
    staticClass: "ca_areaDetail_feedback assort_detail clearfix"
  }, [_h('div', {
    staticClass: "ca_areaDetail_feedback_contactInfo"
  }, [_h('p', [_h('img', {
    attrs: {
      "src": __webpack_require__(30),
      "width": "180",
      "height": "25",
      "alt": ""
    }
  })]), " ", _h('hr'), " ", _h('p', [_h('span', ["地　址："]), _h('b', ["吉林省长春市大丰区大中镇"])]), " ", _h('p', [_h('span', ["联系人："]), _h('b', ["李先生"])]), " ", _h('p', [_h('span', ["手　机："]), _h('b', ["13196640658"])]), " ", _h('p', [_h('span', ["网　址："]), _h('b', ["www.geodeer.com"])]), " ", _h('p', [_h('img', {
    staticStyle: {
      "margin-top": "30px"
    },
    attrs: {
      "src": __webpack_require__(31),
      "width": "68",
      "height": "68",
      "alt": ""
    }
  })])]), " ", _h('div', {
    staticClass: "ca_areaDetail_feedback_input"
  }, [_h('p', [_h('input', {
    attrs: {
      "type": "text",
      "name": "name",
      "placeholder": "姓名"
    }
  })]), " ", _h('p', [_h('input', {
    attrs: {
      "type": "text",
      "name": "email",
      "placeholder": "邮箱"
    }
  })]), " ", _h('p', [_h('textarea', {
    attrs: {
      "name": "content",
      "rows": "5",
      "cols": "",
      "placeholder": "内容"
    }
  })]), " ", _h('p', [_h('input', {
    attrs: {
      "type": "button",
      "name": "submit",
      "value": "提交"
    }
  })])])])]), " ", _h('transition', {
    attrs: {
      "name": "slide-fade"
    }
  }, [_h('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.assortTab == "CONTACT"),
      expression: "assortTab==\"CONTACT\""
    }],
    staticClass: "ca_areaDetail_contact assort_detail"
  }, [_h('div', {
    staticClass: "ca_areaDetail_contact_tab"
  }, [_h('span', {
    on: {
      "click": function($event) {
        _vm.clickContactTab($event, "ADDRESS")
      }
    }
  }, [_h('img', {
    attrs: {
      "data-key": "03address",
      "src": __webpack_require__(22),
      "alt": ""
    }
  })]), " ", _h('span', {
    on: {
      "click": function($event) {
        _vm.clickContactTab($event, "PHONE")
      }
    }
  }, [_h('img', {
    attrs: {
      "data-key": "02phone",
      "src": __webpack_require__(34),
      "alt": ""
    }
  })]), " ", _h('span', {
    on: {
      "click": function($event) {
        _vm.clickContactTab($event, "EMAIL")
      }
    }
  }, [_h('img', {
    attrs: {
      "data-key": "04email",
      "src": __webpack_require__(38),
      "alt": ""
    }
  })]), " ", _h('span', {
    on: {
      "click": function($event) {
        _vm.clickContactTab($event, "WEB")
      }
    }
  }, [_h('img', {
    attrs: {
      "data-key": "05web",
      "src": __webpack_require__(42),
      "alt": ""
    }
  })])]), " ", _h('div', {
    staticClass: "ca_areaDetail_contact_text clearfix"
  }, [(_vm.assortContactTab == "ADDRESS") ? _h('div', {}, [_h('p', ["地址：吉林省长春市迷鹿几何食品"])]) : _vm._e(), " ", (_vm.assortContactTab == "PHONE") ? _h('div', {}, [_h('p', ["电话：13196640658"])]) : _vm._e(), " ", (_vm.assortContactTab == "EMAIL") ? _h('div', {}, [_h('p', ["邮箱：geodeer@163.com"])]) : _vm._e(), " ", (_vm.assortContactTab == "WEB") ? _h('div', {}, [_h('p', ["网址：www.geodeer.com"])]) : _vm._e()])])]), " ", _h('transition', {
    attrs: {
      "name": "slide-fade"
    }
  }, [_h('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.assortTab == "RECRUIT"),
      expression: "assortTab==\"RECRUIT\""
    }],
    staticClass: "ca_areaDetail_recruit assort_detail"
  }, [_h('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.bIsShowRecruitDetail),
      expression: "!bIsShowRecruitDetail"
    }],
    staticClass: "ca_areaDetail_recruit_box"
  }, [_h('div', {
    staticClass: "ca_areaDetail_recruit_search clearfix"
  }, [_h('input', {
    attrs: {
      "type": "text",
      "name": "recruitSearch",
      "value": "",
      "placeholder": "搜索职位"
    }
  }), " ", _h('span', [_h('img', {
    attrs: {
      "src": __webpack_require__(58),
      "alt": "",
      "width": "27",
      "height": "27"
    }
  })])]), " ", _h('div', {
    staticClass: "ca_areaDetail_recruit_list"
  }, [_h('div', {
    staticClass: "recruit_list_nav clearfix"
  }, [_h('span', {
    staticStyle: {
      "width": "25%"
    }
  }, ["职位"]), " ", _h('span', {
    staticStyle: {
      "width": "25%"
    }
  }, ["地点"]), " ", _h('span', {
    staticStyle: {
      "width": "25%"
    }
  }, ["工作年限"]), " ", _h('span', {
    staticStyle: {
      "width": "25%"
    }
  })]), " ", _h('div', {
    staticClass: "recruit_list_ul"
  }, [_h('ul', [_h('li', {
    staticClass: "clearfix"
  }, [_h('span', {
    staticStyle: {
      "width": "25%"
    }
  }, ["投资经理"]), " ", _h('span', {
    staticStyle: {
      "width": "25%"
    }
  }, ["长春"]), " ", _h('span', {
    staticStyle: {
      "width": "25%"
    }
  }, ["3年"]), " ", _h('span', {
    staticStyle: {
      "width": "25%",
      "cursor": "pointer"
    },
    on: {
      "click": function($event) {
        _vm.clickToShowRecruit({})
      }
    }
  }, ["查看"])]), " ", _h('li', {
    staticClass: "clearfix"
  }, [_h('span', {
    staticStyle: {
      "width": "25%"
    }
  }, ["生产组长"]), " ", _h('span', {
    staticStyle: {
      "width": "25%"
    }
  }, ["长春"]), " ", _h('span', {
    staticStyle: {
      "width": "25%"
    }
  }, ["1~2年"]), " ", _h('span', {
    staticStyle: {
      "width": "25%",
      "cursor": "pointer"
    },
    on: {
      "click": function($event) {
        _vm.clickToShowRecruit({})
      }
    }
  }, ["查看"])]), " ", _h('li', {
    staticClass: "clearfix"
  }, [_h('span', {
    staticStyle: {
      "width": "25%"
    }
  }, ["3D动画师"]), " ", _h('span', {
    staticStyle: {
      "width": "25%"
    }
  }, ["大连"]), " ", _h('span', {
    staticStyle: {
      "width": "25%"
    }
  }, ["1~2年"]), " ", _h('span', {
    staticStyle: {
      "width": "25%",
      "cursor": "pointer"
    },
    on: {
      "click": function($event) {
        _vm.clickToShowRecruit({})
      }
    }
  }, ["查看"])]), " ", _h('li', {
    staticClass: "clearfix"
  }, [_h('span', {
    staticStyle: {
      "width": "25%"
    }
  }, ["文秘"]), " ", _h('span', {
    staticStyle: {
      "width": "25%"
    }
  }, ["长春"]), " ", _h('span', {
    staticStyle: {
      "width": "25%"
    }
  }, ["1~2年"]), " ", _h('span', {
    staticStyle: {
      "width": "25%",
      "cursor": "pointer"
    },
    on: {
      "click": function($event) {
        _vm.clickToShowRecruit({})
      }
    }
  }, ["查看"])])])])])]), " ", _h('transition', {
    attrs: {
      "name": "slide-fade"
    }
  }, [(_vm.bIsShowRecruitDetail) ? _h('div', {
    staticClass: "ca_areaDetail_recruit_detail con_text"
  }, [_h('div', {
    staticClass: "ca_areaDetail_recruit_detail_close",
    on: {
      "click": _vm.clickToCloseShowRecruit
    }
  }, [_h('i', ["×"])]), " ", _h('div', {
    staticClass: "con_text"
  }, [_h('h5', ["安装工程师，迷鹿几何，技术类，吉林长春市"]), " ", _h('p', [_h('span', ["\n                                                2018.3.5\n                                            "])]), " ", _h('p', [_h('span', ["\n                                                岗位职责：", _h('br'), "\n                                                1.负责项目的安装部分项目管理工作，包括强电、弱电、给排水、暖通、设备安装的工程管理工作； ", _h('br'), "\n                                                2.根据工程施工计划对安装工程的进度进行监督、检查，并根据情况提出调整意见；", _h('br'), "\n                                                3.参与图纸会审和技术交底病督促执行，跟踪处理图纸会审中提出的问题； ", _h('br'), "\n                                                4.负责审查安装工程相关各单位提出的安装工程变更要求；", _h('br'), "\n                                                5.根据相关规范标准对安装工程施工质量进行控制，对承包单位与监理单位的质量完成情况进行检查考核；", _h('br'), "\n                                                6.对安装工程中出现的不合格事项进行检查，并提出处理意见；", _h('br'), "\n                                                7.参加安装施工验收工作，督促施工单位对验收中提出的问题实施整改，并对整改后的情况进行复验。\n                                            "])]), " ", _h('p', [_h('span', ["\n                                                任职要求：", _h('br'), "\n                                                1.本科及以上学历，工程、电气、给排水、暖通等相关专业；", _h('br'), "\n                                                2.三年以上施工单位或大型房产公司任职经验，有参与商业或旅游地产项目全过程经历优先；", _h('br'), "\n                                                3.熟悉国家及地方相关法规、政策，熟悉安装类施工图、施工规范及要求，有较强的图纸审核及现场施工管理能力，熟悉施工现场管理流程、专业知识；", _h('br'), "\n                                                4.熟练操作Office、Auto CAD等计算机软；", _h('br'), "\n                                                5.富有责任心、事业心及团队合作精神，具有良好的沟通能力，严谨细致，抗压能力强，吃苦耐劳。\n                                            "])]), " ", _h('p', [_h('span', ["\n                                                简历发送邮箱：1846600351@qq.com. 联系电话：13855303932\n                                            "])])])]) : _vm._e()])])])])])]), " ", _h('div', {
    staticClass: "contact_footer"
  }, [_h('div', {
    staticClass: "contact_footerBox"
  }, [_h('Foot')])])])])
},staticRenderFns: []}
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-3d00e12a", module.exports)
  }
}

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _h('div', {
    staticClass: "top"
  }, [_h('div', {
    staticClass: "top_tab clearfix"
  }, [_h('div', {
    staticClass: "top_logo"
  }, [_h('img', {
    attrs: {
      "src": _vm.logo,
      "alt": ""
    }
  })]), " ", _h('div', {
    staticClass: "top_order"
  }, [_h('p', {
    staticClass: "ordersEn"
  }, [_h('router-link', {
    class: _vm.tabType == "HOME" ? "tabActive" : "",
    attrs: {
      "tag": "span",
      "to": "/"
    }
  }, ["HOME", _h('b', ["首页"])]), " ", _h('router-link', {
    class: _vm.tabType == "ABOUT" ? "tabActive" : "",
    attrs: {
      "tag": "span",
      "to": "/about"
    }
  }, ["ABOUT", _h('b', ["关于迷鹿"])]), " ", _h('router-link', {
    class: _vm.tabType == "PRODUCT" ? "tabActive" : "",
    attrs: {
      "tag": "span",
      "to": "/product"
    }
  }, ["PRODUCT", _h('b', ["迷鹿产品"])]), " ", _h('router-link', {
    class: _vm.tabType == "CONTACT" ? "tabActive" : "",
    attrs: {
      "tag": "span",
      "to": "/contact"
    }
  }, ["CONTACT", _h('b', ["联系我们"])]), " ", " ", " ", " "]), " ", _h('hr')]), " ", _h('div', {
    staticClass: "top_others clearfix"
  }, [_h('img', {
    style: ("background-image: url(" + _vm.otherFigurePic + "); background-position: 8px 8px;"),
    attrs: {
      "src": __webpack_require__(2),
      "alt": ""
    }
  }), " ", _h('img', {
    style: ("background-image: url(" + _vm.otherFigurePic + "); background-position: -43px 8px;"),
    attrs: {
      "src": __webpack_require__(2),
      "alt": ""
    }
  }), " ", _h('img', {
    style: ("background-image: url(" + _vm.otherFigurePic + "); background-position: -93px 8px;"),
    attrs: {
      "src": __webpack_require__(2),
      "alt": ""
    }
  })])])])
},staticRenderFns: []}
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-3e9f3ea8", module.exports)
  }
}

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _h('transition', {
    attrs: {
      "name": "fade"
    }
  }, [_h('div', {
    staticClass: "home"
  }, [_h('div', {
    staticClass: "h_top"
  }, [_h('div', {
    staticStyle: {
      "top": "-50px",
      "left": "-50px"
    },
    attrs: {
      "id": "water"
    }
  }), " ", _h('div', {
    staticClass: "h_topTab"
  }, [_h('Top')]), " ", _h('div', {
    staticClass: "h_topLogo"
  }, [_h('img', {
    attrs: {
      "src": __webpack_require__(23),
      "alt": ""
    }
  }), " ", _h('p', ["一点偷闲·就在手边"])])]), " ", _h('div', {
    staticClass: "h_content"
  }, [_h('div', {
    staticClass: "hc_about"
  }, [_h('div', {
    staticClass: "hc_about_title"
  }, [_h('p', ["\n                        Pay attention to the spiritual life of modern professional women.", _h('br'), "\n                        Help soothe the state of depression,", _h('br'), "\n                        Spread the relaxed and leisure culture.\n                    "])]), " ", _h('div', {
    staticClass: "hc_about_content clearfix"
  }, [_h('div', {
    staticClass: "hc_about_cPic"
  }, [_h('img', {
    attrs: {
      "src": __webpack_require__(45),
      "alt": ""
    }
  })]), " ", _h('div', {
    staticClass: "hc_about_cText"
  }, [_h('p', ["\n                            迷鹿几何食品有限公司位于吉林省，是一家以以坚果、干果、茶叶、休闲零食等食品的研发、分装及销售的为主的产业链平台型企业。围绕“帮助现代女性缓解压抑”的使命，迷鹿几何未来的业务范围还将扩展至动漫、影视等领域。\n                            在“大众创业、万众创新”的时代大潮下，迷鹿几何从五个人的创业团队，仅用五年的时间就成为一家年销售额超过50亿元的企业。截至目前，迷鹿几何拥有员工3200多人，平均年龄24.5岁。", _h('br'), "\n                            “做强一个IP，横跨多个产业，以三驾马车为驱动”是迷鹿几何未来五年的战略规划，借此努力实现销售额达300亿+，进入中国500强的目标。从2012年至今，迷鹿几何的产品全面覆盖天猫、京东、苏宁易购等各类电商渠道，并已建成十二个仓储物流中心以及三大配送中心。\n                        "])])]), " ", _h('div', {
    staticClass: "hc_about_btn"
  }, [_h('router-link', {
    attrs: {
      "tag": "input",
      "type": "button",
      "value": "FIND MORE",
      "to": "/about"
    },
    nativeOn: {
      "click": function($event) {
        _vm.clickFindMore()
      }
    }
  })])]), " ", _h('div', {
    staticClass: "hc_product"
  }, [_h('div', {
    staticClass: "hc_product_title clearfix"
  }, [_h('div', [_h('img', {
    staticStyle: {
      "background-image": "url(../images/04figure-2.png)",
      "background-position": "8px 8px"
    },
    attrs: {
      "src": __webpack_require__(2),
      "alt": ""
    }
  }), " ", _h('img', {
    staticStyle: {
      "background-image": "url(../images/04figure-2.png)",
      "background-position": "-43px 8px"
    },
    attrs: {
      "src": __webpack_require__(2),
      "alt": ""
    }
  }), " ", _h('img', {
    staticStyle: {
      "background-image": "url(../images/04figure-2.png)",
      "background-position": "-93px 8px"
    },
    attrs: {
      "src": __webpack_require__(2),
      "alt": ""
    }
  })])]), " ", _h('div', {
    staticClass: "hc_product_content clearfix"
  }, [_h('div', {
    staticClass: "hc_product_cShow hc_product_cShow1"
  }, [_h('img', {
    attrs: {
      "src": __webpack_require__(77),
      "alt": ""
    }
  }), " ", _h('div', {
    staticClass: "hc_product_cShow_shadow clearfix"
  }, [_h('div', {
    staticClass: "shadow_lineTop"
  }), " ", _h('div', {
    staticClass: "shadow_circle"
  }), " ", _h('div', {
    staticClass: "shadow_text"
  }, [_h('span', ["\n                                    The particles are full, mellow and crisp, lightly roasted", _h('br'), "\n                                    The best of the nuts", _h('br')]), " ", _h('b', ["\n                                    ·迷鹿优选榛子·\n                                "])]), " ", _h('div', {
    staticClass: "shadow_lineBottom"
  })])]), " ", _h('div', {
    staticClass: "hc_product_cShow hc_product_cShow2"
  }, [_h('img', {
    attrs: {
      "src": __webpack_require__(78),
      "alt": ""
    }
  }), " ", _h('div', {
    staticClass: "hc_product_cShow_shadow clearfix"
  }, [_h('div', {
    staticClass: "shadow_lineTop"
  }), " ", _h('div', {
    staticClass: "shadow_circle"
  }), " ", _h('div', {
    staticClass: "shadow_text"
  }, [_h('span', ["\n                                    The particles are full, mellow and crisp, lightly roasted", _h('br'), "\n                                    The best of the nuts", _h('br')]), " ", _h('b', ["\n                                    ·迷鹿优选杏仁·\n                                "])]), " ", _h('div', {
    staticClass: "shadow_lineBottom"
  })])]), " ", _h('div', {
    staticClass: "hc_product_cShow hc_product_cShow3"
  }, [_h('img', {
    attrs: {
      "src": __webpack_require__(2),
      "alt": ""
    }
  }), " ", _h('div', {
    staticClass: "hc_product_cShow_light clearfix"
  }, [_h('div', {
    staticClass: "light_advert tb-rl"
  }, ["一点偷闲·就在手边"]), " ", _h('div', {
    staticClass: "light_line"
  }), " ", _h('div', {
    staticClass: "light_pic"
  }, [_h('img', {
    attrs: {
      "src": __webpack_require__(47),
      "width": "255",
      "height": "125",
      "alt": ""
    }
  }), " ", _h('p', ["A little leisure. It's on the hand"])])])]), " ", _h('div', {
    staticClass: "hc_product_cShow hc_product_cShow4"
  }, [_h('img', {
    attrs: {
      "src": __webpack_require__(2),
      "alt": ""
    }
  }), " ", _h('div', {
    staticClass: "hc_product_cShow_weight clearfix"
  }, [_h('div', {
    staticClass: "weight_advert tb-rl"
  }, ["一点偷闲·就在手边"]), " ", _h('div', {
    staticClass: "weight_line"
  }), " ", _h('div', {
    staticClass: "weight_pic"
  }, [_h('img', {
    attrs: {
      "src": __webpack_require__(48),
      "width": "240",
      "height": "240",
      "alt": ""
    }
  })])])]), " ", _h('div', {
    staticClass: "hc_product_cShow hc_product_cShow5"
  }, [_h('img', {
    attrs: {
      "src": __webpack_require__(79),
      "alt": ""
    }
  }), " ", _h('div', {
    staticClass: "hc_product_cShow_shadow clearfix"
  }, [_h('div', {
    staticClass: "shadow_lineTop"
  }), " ", _h('div', {
    staticClass: "shadow_circle"
  }), " ", _h('div', {
    staticClass: "shadow_text"
  }, [_h('span', ["\n                                    The particles are full, mellow and crisp, lightly roasted", _h('br'), "\n                                    The best of the nuts", _h('br')]), " ", _h('b', ["\n                                    ·迷鹿优选核桃·\n                                "])]), " ", _h('div', {
    staticClass: "shadow_lineBottom"
  })])])])]), " ", _h('div', {
    staticClass: "hc_manager"
  }, [_h('div', {
    staticClass: "hc_manager_title"
  }, [_h('p', ["The elegant demeanor of the elite"]), " ", _h('i')]), " ", _h('div', {
    staticClass: "hc_manager_content"
  }, [_h('Manager')])]), " ", _h('div', {
    staticClass: "hc_cooperate clearfix"
  }, [_h('div', [_h('img', {
    attrs: {
      "src": __webpack_require__(26),
      "alt": ""
    }
  }), " ", _h('img', {
    attrs: {
      "src": __webpack_require__(49),
      "alt": ""
    }
  }), " ", _h('img', {
    attrs: {
      "src": __webpack_require__(50),
      "alt": ""
    }
  }), " ", _h('img', {
    attrs: {
      "src": __webpack_require__(51),
      "alt": ""
    }
  }), " ", _h('img', {
    attrs: {
      "src": __webpack_require__(52),
      "alt": ""
    }
  }), " ", _h('img', {
    attrs: {
      "src": __webpack_require__(53),
      "alt": ""
    }
  })])])]), " ", _h('div', {
    staticClass: "h_footer"
  }, [_h('div', {
    staticClass: "h_footerBox"
  }, [_h('Foot')])])])])
},staticRenderFns: []}
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-592f67b8", module.exports)
  }
}

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _h('transition', {
    attrs: {
      "name": "fade"
    }
  }, [_h('div', {
    staticClass: "about"
  }, [_h('div', {
    staticClass: "about_top"
  }, [_h('div', {
    staticClass: "about_topTab"
  }, [_h('Top')])]), " ", _h('div', {
    staticClass: "about_content"
  }, [_h('div', {
    staticClass: "about_contentTab"
  }, [_h('div', {
    staticClass: "about_contentTab_order"
  }, [_h('span', {
    staticClass: "contentTabActive",
    on: {
      "click": function($event) {
        _vm.clickShowACAssort($event, "BRIEF")
      }
    }
  }, ["企业简介"]), " ", _h('i'), " ", _h('span', {
    on: {
      "click": function($event) {
        _vm.clickShowACAssort($event, "CULTURE")
      }
    }
  }, ["企业文化"]), " ", _h('i'), " ", _h('span', {
    on: {
      "click": function($event) {
        _vm.clickShowACAssort($event, "NEWS")
      }
    }
  }, ["迷鹿新闻"]), " ", _h('i'), " ", _h('span', {
    on: {
      "click": function($event) {
        _vm.clickShowACAssort($event, "MANAGER")
      }
    }
  }, ["团队精英"])]), " ", _h('div', {
    staticClass: "about_content_assort"
  }, [_h('transition', {
    attrs: {
      "name": "slide-fade"
    }
  }, [(_vm.contentAssort == "BRIEF") ? _h('div', {
    staticClass: "ac_assort_brief con_text"
  }, [_h('p', [_h('span', [_h('img', {
    attrs: {
      "src": __webpack_require__(32),
      "alt": ""
    }
  })])]), " ", _h('p', ["\n                                迷鹿几何食品有限公司位于吉林省，是一家以以坚果、干果、茶叶、休闲零食等食品的研发、分装及销售的为主的产业链平台型企业。围绕“帮助现代女性缓解压抑”的使命，迷鹿几何未来的业务范围还将扩展至动漫、影视等领域。\n                            "]), " ", _h('p', ["\n                                在“大众创业、万众创新”的时代大潮下，迷鹿几何从五个人的创业团队，仅用五年的时间就成为一家年销售额超过50亿元的企业。截至目前，迷鹿几何拥有员工3200多人，平均年龄24.5岁。\n                            "]), " ", _h('p', ["\n                                “做强一个IP，横跨多个产业，以三驾马车为驱动”是迷鹿几何未来五年的战略规划，借此努力实现销售额达300亿+，进入中国500强的目标。从2012年至今，迷鹿几何的产品全面覆盖天猫、京东、苏宁易购等各类电商渠道，并已建成十二个仓储物流中心以及三大配送中心。\n                            "])]) : _vm._e()]), " ", _h('transition', {
    attrs: {
      "name": "slide-fade"
    }
  }, [(_vm.contentAssort == "CULTURE") ? _h('div', {
    staticClass: "ac_assort_culture con_text"
  }, [_h('p', [_h('span', [_h('img', {
    attrs: {
      "src": __webpack_require__(35),
      "alt": ""
    }
  })])]), " ", _h('p', [_h('span', ["\n                                    品牌slogan：一点偷闲，就在手边。", _h('br'), "\n                                    都市白领女性长期处于压抑状态下，长此以往，对于身体和精神的健康也很不利，我们提出“减压休闲坚果”的概念，既是为了联想“压抑场景”及“舒缓作用”，从而与竞品做有效区别，也是希望对于女性更多维度的健康和发展做更多的努力。", _h('br'), "\n                                    坚果在“职场”这个比较严肃的场合出现时，食用过程可能会由于需要剥壳而不方便，slogan力求在传递“减压休闲”概念、表达轻松愉悦氛围的同时，摒除负面印象，传达“随时随地帮你解压”的轻松之感。\n                                "])]), " ", _h('p', [_h('span', ["品牌调性：简约精致、轻松休闲。"])]), " ", _h('p', [_h('span', ["迷鹿使命：关注现代职业女性的精神生活，帮助舒缓压抑状态，传播轻松休闲文化."])]), " ", _h('p', [_h('span', ["迷鹿愿景：成为持续为消费者、合作伙伴、员工创造新价值的公司；成为一家透明、简单、信任的公司；成为一个让员工有安全感、幸福感的大家庭。"])])]) : _vm._e()]), " ", _h('transition', {
    attrs: {
      "name": "slide-fade"
    }
  }, [(_vm.contentAssort == "NEWS") ? _h('div', {
    staticClass: "ac_assort_news"
  }, [_h('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.bIsNewsDetailShow),
      expression: "!bIsNewsDetailShow"
    }],
    staticClass: "ac_assort_newsPages"
  }, [_h('div', {
    staticClass: "ac_assort_newsPages_box"
  }, [_h('div', {
    staticClass: "aca_news"
  }, [_h('b', ["2018-3-15"]), " ", _h('hr'), " ", _h('h5', ["迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】"]), " ", _h('p', ["\n                                            2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。\n                                        "]), " ", _h('i', {
    on: {
      "click": function($event) {
        _vm.clickShowNewsText()
      }
    }
  }, [">>"])]), " ", _h('div', {
    staticClass: "aca_news"
  }, [_h('b', ["2018-3-15"]), " ", _h('hr'), " ", _h('h5', ["迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】"]), " ", _h('p', ["\n                                            2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。\n                                        "]), " ", _h('i', [">>"])]), " ", _h('div', {
    staticClass: "aca_news"
  }, [_h('b', ["2018-3-15"]), " ", _h('hr'), " ", _h('h5', ["迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】"]), " ", _h('p', ["\n                                            2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。\n                                        "]), " ", _h('i', [">>"])]), " ", _h('div', {
    staticClass: "aca_news"
  }, [_h('b', ["2018-3-15"]), " ", _h('hr'), " ", _h('h5', ["迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】"]), " ", _h('p', ["\n                                            2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。\n                                        "]), " ", _h('i', [">>"])]), " ", _h('div', {
    staticClass: "aca_news"
  }, [_h('b', ["2018-3-15"]), " ", _h('hr'), " ", _h('h5', ["迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】"]), " ", _h('p', ["\n                                            2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。\n                                        "]), " ", _h('i', [">>"])]), " ", _h('div', {
    staticClass: "aca_news"
  }, [_h('b', ["2018-3-15"]), " ", _h('hr'), " ", _h('h5', ["迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】"]), " ", _h('p', ["\n                                            2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。\n                                        "]), " ", _h('i', [">>"])]), " ", _h('div', {
    staticClass: "aca_news"
  }, [_h('b', ["2018-3-15"]), " ", _h('hr'), " ", _h('h5', ["迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】"]), " ", _h('p', ["\n                                            2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。\n                                        "]), " ", _h('i', [">>"])]), " ", _h('div', {
    staticClass: "aca_news"
  }, [_h('b', ["2018-3-15"]), " ", _h('hr'), " ", _h('h5', ["迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】"]), " ", _h('p', ["\n                                            2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。\n                                        "]), " ", _h('i', [">>"])]), " ", _h('div', {
    staticClass: "aca_news"
  }, [_h('b', ["2018-3-15"]), " ", _h('hr'), " ", _h('h5', ["迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】"]), " ", _h('p', ["\n                                            2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。\n                                        "]), " ", _h('i', [">>"])]), " ", _h('div', {
    staticClass: "aca_news"
  }, [_h('b', ["2018-3-15"]), " ", _h('hr'), " ", _h('h5', ["迷鹿几何每日坚果惊艳亮相【东京国际食品展】迷鹿几何每日坚果惊艳亮相【东京国际食品展】"]), " ", _h('p', ["\n                                            2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。2018年3月15日，第43届东京国际食品饮料展在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展。\n                                        "]), " ", _h('i', [">>"])])])]), " ", _h('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.bIsNewsDetailShow),
      expression: "bIsNewsDetailShow"
    }],
    staticClass: "ac_assort_newsText "
  }, [_h('div', {
    staticClass: "ac_assort_newsText_close"
  }, [_h('i', {
    on: {
      "click": _vm.clickCloseNewsText
    }
  }, ["×"])]), " ", _h('div', {
    staticClass: "ac_assort_newsText_box con_text"
  }, [_h('h5', ["迷鹿几何每日坚果惊艳亮相【东京国际食品展】"]), " ", _h('b', ["2018.3.5   来源：网易新闻"]), " ", _h('p', [_h('span', [_h('img', {
    attrs: {
      "src": __webpack_require__(24),
      "alt": ""
    }
  })])]), " ", _h('p', ["\n                                        2018年3月5日，第43届东京国际食品饮料展（FOODEX）在日本千叶幕张国际展览中心举行，来自世界各地的食品、饮料企业共3400家参展，开幕吸引专业采购商16604人。\n                                    "]), " ", _h('p', ["\n                                        据了解，东京国际食品饮料展是亚太地区规模最大、声誉最高、品种最全、交易量最大的食品和饮料专项展览会。规模仅次于德国科隆、法国巴黎国际食品展，位列世界第三大规模。\n                                    "]), " ", _h('p', ["\n                                        东京国际食品饮料展为期4天，此次展会，迷鹿几何作为行业优秀企业代表参展，在众多品牌中，以新颖的产品理念与良好的用户口碑，受到日本客商与消费者的青睐。\n                                    "]), " ", _h('p', ["\n                                        理念新颖：迷鹿几何每日坚果系列产品由沃隆团队自主创新研发，以“甄选全球每一颗”“每日25g 营养定制”的核心产品理念，率先在国内市场倡导“沃隆每日坚果,引领健康生活”的消费理念。将“坚果”变成“每日坚果”，引领国内坚果市场进入2.0时代。\n                                    "]), " ", _h('p', ["\n                                        优质品质：迷鹿几何每日坚果中所有坚果果干的原料，均源自全球领先产区的优质原料基地。并采用轻烤烘焙工艺,坚守原味无添加,配料表为百分百坚果配比,无任何添加剂。\n                                    "]), " ", _h('p', ["\n                                        科学配比：迷鹿几何根据人体每日所需营养，将6种全球优质坚果果干科学配比制成，每日定量25g，开创了“每日坚果”品类，也开创了一个健康的新食代。\n                                    "])])])]) : _vm._e()]), " ", _h('transition', {
    attrs: {
      "name": "slide-fade"
    }
  }, [(_vm.contentAssort == "MANAGER") ? _h('div', {
    staticClass: "ac_assort_manager"
  }, [_h('div', {
    staticClass: "ac_assort_manager_box"
  }, [_h('Manager')])]) : _vm._e()])])])]), " ", _h('div', {
    staticClass: "about_footer"
  }, [_h('div', {
    staticClass: "about_footerBox"
  }, [_h('Foot')])])])])
},staticRenderFns: []}
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-63b2bdd0", module.exports)
  }
}

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _h('transition', {
    attrs: {
      "name": "fade"
    }
  }, [_h('div', {
    staticClass: "product"
  }, [_h('div', {
    staticClass: "product_top"
  }, [_h('div', {
    staticClass: "product_topTab"
  }, [_h('Top')])]), " ", _h('div', {
    staticClass: "product_assort"
  }, [_h('div', {
    staticClass: "product_assort_area"
  }, [_h('div', {
    staticClass: "product_assort_areaTab"
  }, [_h('span', {
    staticClass: "assortTabActive",
    on: {
      "click": function($event) {
        _vm.clickShowProAssort($event, "MIXEDNUT")
      }
    }
  }, ["混合坚果系列"]), " ", _h('i'), " ", _h('span', {
    on: {
      "click": function($event) {
        _vm.clickShowProAssort($event, "PARTABLEBAG")
      }
    }
  }, ["便携袋装系列"]), " ", _h('i'), " ", _h('span', {
    on: {
      "click": function($event) {
        _vm.clickShowProAssort($event, "BOXED")
      }
    }
  }, ["畅想盒装系列"])]), " ", _h('div', {
    staticClass: "product_assort_areaDetail"
  }, [_h('transition', {
    attrs: {
      "name": "slide-fade"
    }
  }, [(_vm.assortTab == "MIXEDNUT") ? _h('div', {
    staticClass: "pa_areaDetail_mixednut con_text"
  }, [_h('div', {
    staticClass: "con_image",
    staticStyle: {
      "width": "1200px",
      "position": "relative"
    }
  }, [_h('p', [_h('span', [_h('img', {
    staticStyle: {
      "max-width": "490px"
    },
    attrs: {
      "src": __webpack_require__(21),
      "alt": ""
    }
  })])])]), " ", _h('p', ["\n                                迷鹿几何食品有限公司位于吉林省，是一家以以坚果、干果、茶叶、休闲零食等食品的研发、分装及销售的为主的产业链平台型企业。围绕“帮助现代女性缓解压抑”的使命，迷鹿几何未来的业务范围还将扩展至动漫、影视等领域。\n                            "]), " ", _h('p', ["\n                                在“大众创业、万众创新”的时代大潮下，迷鹿几何从五个人的创业团队，仅用五年的时间就成为一家年销售额超过50亿元的企业。截至目前，迷鹿几何拥有员工3200多人，平均年龄24.5岁。\n                            "]), " ", _h('p', ["\n                                “做强一个IP，横跨多个产业，以三驾马车为驱动”是迷鹿几何未来五年的战略规划，借此努力实现销售额达300亿+，进入中国500强的目标。从2012年至今，迷鹿几何的产品全面覆盖天猫、京东、苏宁易购等各类电商渠道，并已建成十二个仓储物流中心以及三大配送中心。\n                            "])]) : _vm._e()]), " ", _h('transition', {
    attrs: {
      "name": "slide-fade"
    }
  }, [(_vm.assortTab == "PARTABLEBAG") ? _h('div', {
    staticClass: "pa_areaDetail_partablebag con_text"
  }, [_h('div', {
    staticClass: "con_image",
    staticStyle: {
      "width": "1200px",
      "position": "relative"
    }
  }, [_h('p', [_h('span', [_h('img', {
    staticStyle: {
      "max-width": "320px"
    },
    attrs: {
      "src": __webpack_require__(25),
      "alt": ""
    }
  })])]), " ", _h('p', [_h('span', [_h('img', {
    staticStyle: {
      "max-width": "320px"
    },
    attrs: {
      "src": __webpack_require__(43),
      "alt": ""
    }
  })])]), " ", _h('p', [_h('span', [_h('img', {
    staticStyle: {
      "max-width": "320px"
    },
    attrs: {
      "src": __webpack_require__(44),
      "alt": ""
    }
  })])])]), " ", _h('p', ["\n                                迷鹿几何食品有限公司位于吉林省，是一家以以坚果、干果、茶叶、休闲零食等食品的研发、分装及销售的为主的产业链平台型企业。围绕“帮助现代女性缓解压抑”的使命，迷鹿几何未来的业务范围还将扩展至动漫、影视等领域。\n                            "]), " ", _h('p', ["\n                                在“大众创业、万众创新”的时代大潮下，迷鹿几何从五个人的创业团队，仅用五年的时间就成为一家年销售额超过50亿元的企业。截至目前，迷鹿几何拥有员工3200多人，平均年龄24.5岁。\n                            "]), " ", _h('p', ["\n                                “做强一个IP，横跨多个产业，以三驾马车为驱动”是迷鹿几何未来五年的战略规划，借此努力实现销售额达300亿+，进入中国500强的目标。从2012年至今，迷鹿几何的产品全面覆盖天猫、京东、苏宁易购等各类电商渠道，并已建成十二个仓储物流中心以及三大配送中心。\n                            "])]) : _vm._e()]), " ", _h('transition', {
    attrs: {
      "name": "slide-fade"
    }
  }, [(_vm.assortTab == "BOXED") ? _h('div', {
    staticClass: "pa_areaDetail_boxed con_text"
  }, [_h('div', {
    staticClass: "con_image",
    staticStyle: {
      "width": "1200px",
      "position": "relative"
    }
  }, [_h('p', [_h('span', [_h('img', {
    staticStyle: {
      "max-width": "490px"
    },
    attrs: {
      "src": __webpack_require__(46),
      "alt": ""
    }
  })])])]), " ", _h('p', ["\n                                迷鹿几何食品有限公司位于吉林省，是一家以以坚果、干果、茶叶、休闲零食等食品的研发、分装及销售的为主的产业链平台型企业。围绕“帮助现代女性缓解压抑”的使命，迷鹿几何未来的业务范围还将扩展至动漫、影视等领域。\n                            "]), " ", _h('p', ["\n                                在“大众创业、万众创新”的时代大潮下，迷鹿几何从五个人的创业团队，仅用五年的时间就成为一家年销售额超过50亿元的企业。截至目前，迷鹿几何拥有员工3200多人，平均年龄24.5岁。\n                            "]), " ", _h('p', ["\n                                “做强一个IP，横跨多个产业，以三驾马车为驱动”是迷鹿几何未来五年的战略规划，借此努力实现销售额达300亿+，进入中国500强的目标。从2012年至今，迷鹿几何的产品全面覆盖天猫、京东、苏宁易购等各类电商渠道，并已建成十二个仓储物流中心以及三大配送中心。\n                            "])]) : _vm._e()])])])]), " ", _h('div', {
    staticClass: "product_footer"
  }, [_h('div', {
    staticClass: "product_footerBox"
  }, [_h('Foot')])])])])
},staticRenderFns: []}
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-f3b18e8c", module.exports)
  }
}

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(5)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(11, function() {
			var newContent = __webpack_require__(11);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(5)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(12, function() {
			var newContent = __webpack_require__(12);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(5)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(13, function() {
			var newContent = __webpack_require__(13);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(14);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(5)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(14, function() {
			var newContent = __webpack_require__(14);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(15);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(5)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(15, function() {
			var newContent = __webpack_require__(15);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(16);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(5)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(16, function() {
			var newContent = __webpack_require__(16);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(17);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(5)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(17, function() {
			var newContent = __webpack_require__(17);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(18);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(5)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(18, function() {
			var newContent = __webpack_require__(18);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./02mixednuts-1.png": 21,
	"./02phone-1.png": 33,
	"./03address-1.png": 22,
	"./03figure-1.png": 23,
	"./04email-1.png": 37,
	"./04news-1.png": 24,
	"./05web-1.png": 41,
	"./06Bagged-1.png": 25,
	"./13Cooperativepartner-1.png": 26
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 103;

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./01Firstpicture.png": 29,
	"./01lianxiwomen.png": 30,
	"./01logo.png": 20,
	"./02Firstpicture.png": 4,
	"./02erweima.png": 31,
	"./02introduction.png": 32,
	"./02mixednuts-1.png": 21,
	"./02phone-1.png": 33,
	"./02phone.png": 34,
	"./03address-1.png": 22,
	"./03address.png": 76,
	"./03culture.png": 35,
	"./03figure-1.png": 23,
	"./03figure-2.png": 36,
	"./04email-1.png": 37,
	"./04email.png": 38,
	"./04figure-2.png": 39,
	"./04news-1.png": 24,
	"./05figure-3.png": 40,
	"./05web-1.png": 41,
	"./05web.png": 42,
	"./06Bagged-1.png": 25,
	"./06Bagged-2.png": 43,
	"./06Bagged-3.png": 44,
	"./06deer.png": 45,
	"./08box.png": 46,
	"./09nut-3.png": 47,
	"./10nut-4.png": 48,
	"./13Cooperativepartner-1.png": 26,
	"./14Cooperativepartner-2.png": 49,
	"./15Cooperativepartner-3.png": 50,
	"./16Cooperativepartner-4.png": 51,
	"./18Cooperativepartner-6.png": 52,
	"./19Cooperativepartner-7.png": 53,
	"./20Bottompicture.png": 8,
	"./22wechart.png": 54,
	"./23qq.png": 55,
	"./24wb.png": 56,
	"./map.png": 57,
	"./point.png": 2,
	"./search.png": 58
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 104;

/***/ })
/******/ ]);