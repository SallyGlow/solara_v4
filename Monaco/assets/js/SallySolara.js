		require.config({
			paths: {
				'vs': 'vs'
			}
		});

		var editor;
		var Proposals = [];

		var SetText;
		var ShowMinimap;
		var HideMinimap;
		var EnableAutoComplete;
		var DisableAutoComplete;
		var GetText;
		var AddIntellisense;
		var Refresh;
	


		require(['vs/editor/editor.main'], function () {
			function getDependencyProposals() {
				return Proposals;
			}

			

			monaco.languages.registerCompletionItemProvider('lua', {
				provideCompletionItems: function (model, position) {
					return getDependencyProposals();
				},

			});


			monaco.editor.defineTheme('net-theme-dark', {
				base: 'vs-dark',
				inherit: true,
				colors: {
					"editor.background": '#040007',
				},
				rules: [{
						token: 'global',
						foreground: 'aa80ff', // //FFFFFF
						fontStyle: "bold"
					},
					{
						token: 'keyword',
						foreground: 'cc99cc',
						fontStyle: "bold"
					},
					{
						token: 'comment',
						foreground: '999999'
					},
					{
						token: 'number',
						foreground: 'f99157'
					},
					{
						token: 'string',
						foreground: 'ddccff'
					},
					{
						token: 'Method',
						foreground: 'ffa1dc'
					},
				]
			});

			editor = monaco.editor.create(document.getElementById('container'), {
				language: 'lua',
				theme: "net-theme-dark",
				acceptSuggestionOnEnter: "smart",
				suggestOnTriggerCharacters: true,
				suggestSelection: "recentlyUsed",
				folding: true,
				wordBasedSuggestions : true,
				scrollbar: {
					verticalHasArrows: true,
				},
				dragAndDrop: true,
				links: true,
				minimap: {
					enabled: false,
				},
				showFoldingControls: "always",
				smoothScrolling: true,
			});

			EnableAutoComplete = function(){
				editor.updateOptions({
					suggestOnTriggerCharacters: true,
					acceptSuggestionOnEnter : "smart",
					wordBasedSuggestions : true
				});
			}

			DisableAutoComplete = function(){
				editor.updateOptions({
					suggestOnTriggerCharacters: false,
					acceptSuggestionOnEnter : "off",
					wordBasedSuggestions : false
				});
			}

			window.onresize = function () {
				editor.layout();
			};

			ShowMinimap = function () {
				editor.updateOptions({
					minimap: {
						enabled: true,
					}
				});
			}

			HideMinimap = function () {
				editor.updateOptions({
					minimap: {
						enabled: false,
					}
				});
			}



			editor.onDidChangeModelContent(function (e) {
				window.chrome.webview.postMessage(editor.getValue())
			});

			GetText = function () {
				var value = editor.getValue();
				return value.startsWith('"') && value.endsWith('"') ? value.slice(1, -1) : value;
			}

			SetText = function (x) {
				editor.setValue(x);
			}

			AddIntellisense = function (l, k, d, i) {
				var t;
				switch (k) {
					case "Class":
						t = monaco.languages.CompletionItemKind.Class;
						break;
					case "Color":
						t = monaco.languages.CompletionItemKind.Color;
						break;
					case "Constructor":
						t = monaco.languages.CompletionItemKind.Constructor;
						break;
					case "Enum":
						t = monaco.languages.CompletionItemKind.Enum;
						break;
					case "Field":
						t = monaco.languages.CompletionItemKind.Field;
						break;
					case "File":
						t = monaco.languages.CompletionItemKind.File;
						break;
					case "Folder":
						t = monaco.languages.CompletionItemKind.Folder;
						break;
					case "Function":
						t = monaco.languages.CompletionItemKind.Function;
						break;
					case "Interface":
						t = monaco.languages.CompletionItemKind.Interface;
						break;
					case "Keyword":
						t = monaco.languages.CompletionItemKind.Keyword;
						break;
					case "Method":
						t = monaco.languages.CompletionItemKind.Method;
						break;
					case "Module":
						t = monaco.languages.CompletionItemKind.Module;
						break;
					case "Property":
						t = monaco.languages.CompletionItemKind.Property;
						break;
					case "Reference":
						t = monaco.languages.CompletionItemKind.Reference;
						break;
					case "Snippet":
						t = monaco.languages.CompletionItemKind.Snippet;
						break;
					case "Text":
						t = monaco.languages.CompletionItemKind.Text;
						break;
					case "Unit":
						t = monaco.languages.CompletionItemKind.Unit;
						break;
					case "Value":
						t = monaco.languages.CompletionItemKind.Value;
						break;
					case "Variable":
						t = monaco.languages.CompletionItemKind.Variable;
						break;
				}

				Proposals.push({
					label: l,
					kind: t,
					detail: d,
					insertText: i
				});
			}
			async function load() {
				var docs = await(await fetch('https://solaraweb.vercel.app/asset/docs.txt')).json();

				for (var prop in docs) {
  					  for(var item in docs[prop])
					  {
						    const document = docs[prop][item];
							AddIntellisense(document.label, document.type, document.description, document.insert);
					  }
				}

				for (const Key of ["_G", "_VERSION", "Enum", "game", "plugin", "shared", "script", "workspace", "DebuggerManager", "elapsedTime", "LoadLibrary", "PluginManager", "settings", "tick", "time", "typeof", "UserSettings", "HumanoidRootPart"])
					AddIntellisense(Key, "Keyword", Key, Key);

				for (const Key of ["and", "break", "do", "else", "elseif", "end", "false", "for", "function", "if", "in", "local", "nil", "not", "or", "repeat", "return", "then", "true", "until", "while"])
					AddIntellisense(Key, "Variable", Key, Key);

				for (const Key of ["math.abs", "math.acos", "math.asin", "math.atan", "math.atan2", "math.ceil", "math.cos", "math.cosh", "math.deg", "math.exp", "math.floor", "math.fmod", "math.frexp", "math.huge", "math.ldexp", "math.log", "math.max", "math.min", "math.modf", "math.pi", "math.pow", "math.rad", "math.random", "math.randomseed", "math.sin", "math.sinh", "math.sqrt", "math.tan", "math.tanh", "table.concat", "table.foreach", "table.foreachi", "table.sort", "table.insert", "table.remove", "Color3.new", "Instance.new", "BrickColor.new", "Vector3.new", "Vector2.new", "debug.getinfo", "string.byte", "string.char", "string.dump", "string.find", "string.format", "string.gmatch", "string.gsub", "string.len", "string.lower", "string.match", "string.rep", "string.reverse", "string.sub", "string.upper", "coroutine.create", "coroutine.resume", "coroutine.running", "coroutine.status", "coroutine.wrap", "coroutine.yield"])
					AddIntellisense(Key, "Method", Key, Key);

				for (const Key of ["Drawing", "debug", "Instance", "Color3", "Vector3", "Vector2", "BrickColor", "math", "table", "string", "coroutine", "Humanoid", "ClickDetector", "LocalScript", "Model", "ModuleScript", "Mouse", "Part", "Script", "Tool", "RunService", "UserInputService", "Workspace", "ReplicatedFirst", "SoundService", "Character", "CoreGui", "ReplicatedStorage", "Lighting", "Players", "PlayerGui", "PlayerScript", "LocalPlayer", "Parent"])
					AddIntellisense(Key, "Class", Key, Key);

				for (const Key of ["print", "warn", "wait", "info", "printidentity", "assert", "collectgarbage", "error", "getfenv", "getmetatable", "setmetatable", "ipairs", "loadfile", "loadstring", "newproxy", "next", "pairs", "pcall", "spawn", "rawequal","rawget", "rawset", "select", "tonumber", "tostring", "type", "unpack", "xpcall", "delay", "stats", ":Remove()", ":BreakJoints()", ":GetChildren()", ":FindFirstChild()", ":FireServer()", ":InvokeServer()", ":ClearAllChildren()", ":Clone()", ":Destroy()", ":FindFirstAncestor()", ":FindFirstAncestorOfClass()", ":FindFirstAncestorWhichIsA()", ":FindFirstChildOfClass()", ":FindFirstChildWhichIsA()", ":GetDebugId()", ":GetDescendants()", ":GetFullName()", ":IsA()", ":GetPropertyChangedSignal()", ":IsAncestorOf()", ":IsDescendantOf()", ":WaitForChild()", ":Connect()", ":AncestryChanged()", ":Changed()", ":ChildAdded()", ":ChildRemoved()", ":DescendantAdded()", ":DescendantRemoving()", ":GetService()", ":GetObjects()", ":HttpGet()", ":Wait()"])
					AddIntellisense(Key, "Function", Key, Key.includes(":") ? Key.substring(1, Key.length) : Key);


                for (const Key of ["Visible", "Color", "Transparency", "Thickness", "From", "To", "Text", "Size", "Center", "Outline", "OutlineColor", "Position", "TextBounds", "Font", "Data", "Rounding", "NumSides", "Radius", "Filled", "PointA", "PointB", "PointC", "PointD"])
					AddIntellisense(Key, "Property", "Property for Drawing Library", Key);

			}
			load();
			Refresh = function () {
				var text = GetText();
				SetText('');
				editor.trigger('keyboard', 'type', {
					text: text
				});
			}
			
			window.editorInstance = editor;

			// Modify this method
			editor.getEditorValue = function() {
				var value = editor.getValue();
				return JSON.stringify({ value: value });
			};
		});



        // تحميل الاسم المحفوظ من localStorage
window.onload = function () {
  const savedName = localStorage.getItem('tabName');
  if (savedName) {
    document.getElementById('tab').textContent = '✨ ' + savedName;
  }
};

// عند الضغط كلك يمين
function renameTab(event) {
  event.preventDefault(); // منع قائمة الكلك يمين الافتراضية
  const newName = prompt('غيّر اسم التبويبة:');
  if (newName && newName.trim() !== "") {
    const tab = document.getElementById('tab');
    tab.textContent = '✨ ' + newName.trim();
    tab.classList.add("animate"); // إضافة تأثير
    setTimeout(() => tab.classList.remove("animate"), 600);
    localStorage.setItem('tabName', newName.trim());
  }
}