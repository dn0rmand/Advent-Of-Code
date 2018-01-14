
const globals = require('./globals.js');

module.exports = globals.declare('ui', () => 
{
    const input = require('./input.js');
    const output = require('./output.js');
    const blessed = require("blessed");
    
    let isDirty = false;
    let ui;

    function getScreen()
    {
        let screen = blessed.screen({
            smartCSR: true,
            dockBorders: true
        });
        screen.title = 'Synacor Challenge';

        const $exit = process.exit;

        process.exit = function (code) {
            screen.destroy();
            $exit(code);
        }
    
        return screen;        
    }

    function getCodeBox(screen)
    {
        let box = blessed.list({
            label: 'Code',
            parent: screen,
            top: 0,
            left: 100,
            width: screen.width - 100,
            height: 30,
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                bg: 'black',
                border: {
                    fg: 'white',
                    bg: 'black'
                }
            },
            mouse: true,
            input: true
        });        

        return box;
    }

    function getOutputBox(screen)
    {
        let outputBox = blessed.log({
            parent: screen,
            top: 0,
            left: 0,
            label: 'Output',
            width: 100,
            height: 30,
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                bg: 'blue',
                border: {
                    fg: 'white',
                    bg: 'blue'
                }
            },
            input: false
        });        

        output.didPrint = function (value) {
            outputBox.log(value);
            isDirty = true;
        }
    
        return outputBox;
    }

    function getInputBox(screen, outtbox)
    {
        let inputBox = blessed.textbox({
            parent: screen,
            name: 'input',
            label: 'Input',
            input: true,
            keys: true,
            top: screen.height-3,
            left: 0,
            height: 3,
            width: screen.width-90,
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                bg: 'blue',
                border: {
                    fg: 'white',
                    bg: 'blue'
                }
            }
        });  

        inputBox.on('submit', (data) => {
            if (data == '')
                return;
            if (data == 'exit')
                process.exit(0);

            input.addCommand(data);
            if (outputBox !== undefined) {
                outputBox.setContent('');
                outputBox.resetScroll();
            }
            isDirty = true;
        });

        input.getData = function (callback) 
        {
            inputBox.clearValue();
            inputBox.focus();

            inputBox.readInput(() => { 
                callback([]); 
            });
        }

        inputBox.focus();
        inputBox.on('blur', () => {
            if (screen.focused != inputBox)
                inputBox.focus();
        })
        return inputBox;
    }

    function getRegisterBox(screen)
    {
        let width = 90;
        let registerBox = blessed.box({
            label: 'Registers',
            parent: screen,
            top: screen.height-3,
            left: screen.width-width,
            width: width,
            height: 3,
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                bg: 'blue',
                border: {
                    fg: 'white',
                    bg: 'blue'
                }
            }
        });

        return registerBox;
    }

    function getDebugBox(screen)
    {
        let traceBox = blessed.log({
            parent: screen,
            label: 'Debug Output',
            top: 30,
            left: 0,
            width: 100,
            height: 17,
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                bg: 'red',
                border: {
                    fg: 'white',
                    bg: 'red'
                }
            },
            input: false
        });
    
        console.log = function(value) {
            traceBox.log(value);
            isDirty = true;
        }

        return traceBox;
    }

    let screen      = getScreen();
    let outputBox   = getOutputBox(screen);
    let traceBox    = getDebugBox(screen);
    let registerBox = getRegisterBox(screen);
    let inputBox    = getInputBox(screen, outputBox);
    let codeBox     = getCodeBox(screen);

    screen.render();

    ui = {
        screen:     screen,
        output:     outputBox,
        input:      inputBox,
        registers:  registerBox,
        trace:      traceBox,
        code:       codeBox,

        updateCode: function() {},
        updateRegisters: function() {}, 
        render: function(dirty) {
            if (isDirty || dirty)
            {
                this.screen.render();
                isDirty = false;
                return true;
            }
            else
                return false;
        },
        updateAll: function()
        {
            ui.updateRegisters();
            ui.updateCode();
            ui.render();    
        }
    };

    return ui;
});
