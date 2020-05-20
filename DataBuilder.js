
class FakeDump {
    parseLine(data, line) {
        return true;
    }
}
class ProfileDump {
    regex00 = /\[[0-9]+\]\stick\(([0-9]+)\/([0-9]+)\){1}\s-\s([.0-9]*%)\/([.0-9]*%)/g;
    regex01 = /\[[[0-9]{2}\] \|\s*(\w+)\(([0-9]+)\/[0-9]+\)\s-\s([0-9.]+%)\/([0-9.]+%)/g;
    regex02 = /\[[[0-9]{2}\] (\|\s*){2}([\w\s:]+)\(([0-9]+)\/[0-9]+\)\s-\s([0-9.]+%)\/([0-9.]+%)/g;
    regex02 = /\[[[0-9]{2}\] (\|\s*){3}([\w\s:]+)\(([0-9]+)\/[0-9]+\)\s-\s([0-9.]+%)\/([0-9.]+%)/g;
    lastLevel = '';
    lastClassification = '';
    parseLine(data, line) {
        if(line.startsWith('[00]')) {
            let matches = this.regex00.exec(line);
            data.percent1 = matches[3];
            data.percent2 = matches[4];
        }
        else if(line.startsWith('[01]')) {
            //[01] |   levels(29715/1) - 88.47%/85.92%
            //01 represents things that can take up the profile'd time
            //For instance, levels (overworld, nether, end), or commands
            let matches = this.regex01.exec(line);
            if(!data.categories) {
                data.categories = {};
            }
            this.lastLevel = matches[1];
            data.categories[this.lastLevel] = {
                span: matches[2]
                , percent1: matches[3]
                , percent2: matches[4]
            };
        }
        else if(line.startsWith('[02]')) {
            let matches = this.regex02.exec(line);
            if(!data.categories[this.lastLevel].classifications) {
                data.categories[this.lastLevel].classifications = {};
            }
            this.lastClassification = matches[2]
            data.categories[this.lastLevel].classifications[this.lastClassification] = {
                span: matches[3]
                , percent1: matches[4]
                , percent2: matches[5]
            };
        }
        else if(line.startsWith('[03]')) {
            let matches = this.regex03.exec(line);
            if(!data.categories[this.lastLevel].classifications[this.lastClassification]) {
                data.categories[this.lastLevel].classifications[this.lastClassification] = {};
            }
            data.categories[this.lastLevel].classifications[this.lastClassification] = {
                span: matches[3]
                , percent1: matches[4]
                , percent2: matches[5]
            };
        }
        else if(line.startsWith("--- END PROFILE DUMP ---")) {
            return new FakeDump();
        }
        return true;
    }
}
class Initial {
    parseLine(data, line) {
        if(line.startsWith("Version:")) {
            data.version = line.split(/(Version: )([0-9.]+)/g)[2]
        }
        else if(line.startsWith("Time span:")) {
            let lineData = line.split(/(Time span: )([0-9]+)\s(ms)/g)
            data.span = {
                length: lineData[2]
                , unit: lineData[3]
            }
        }
        else if(line.startsWith("Tick span:")) {
            let lineData = line.split(/(Tick span: )([0-9]+)\s(ticks)/g);
            console.log({lineData})
            data.tick = {
                span: lineData[2]
                , unit: lineData[3]
            }
        }
        else if(line.startsWith("// This is approximately")) {
            data.approxTicks = line.split(/(\/\/ This is approximately )+([0-9.]+)/i)[2]
        }
        else if(line.startsWith("--- BEGIN PROFILE DUMP ---")) {
            return new ProfileDump();
        }
        return true;
    }
}

class DataBuilder {
    states = {
        initial: new Initial()
        , profileDump: new ProfileDump()
    }
    constructor() {
        this.state = this.states.initial;
        this.data = {};
    }
    transition(state) {
        this.state = state;
    }
    parseLine(line) {
        let result = this.state.parseLine(this.data, line);
        if(result !== true) {
            this.transition(result);
        }
    }
    getData() {
        return JSON.stringify(this.data, null, 4);
    }
}


module.exports = {
    DataBuilder
    , ProfileDump
    , Initial
}