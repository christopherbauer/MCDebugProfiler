
class FakeDump {
    parseLine(data, line) {
        return true;
    }
}
class ProfileDump {
    regex00 = /\[[0-9]+\]\stick\(([0-9]+)\/([0-9]+)\){1}\s-\s([.0-9]*%)\/([.0-9]*%)/g;
    parseLine(data, line) {
        if(line.startsWith('[00]')) {
            console.log({
                line, regex00: this.regex00
            });
            let matches = this.regex00.exec(line);
            data.tickTotalBreakdownPercent = matches[3];
            data.tickTotalBreakdownPercentTotal = matches[4];
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
            data.span = line.split(/(Time span: )([0-9]+\sms)/g)[2]
        }
        else if(line.startsWith("Time span:")) {
            data.tickspan = line.split(/(Tick span: )([0-9]+\sms)/g)[2]
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
        return this.data;
    }
}


module.exports = {
    DataBuilder
    , ProfileDump
    , Initial
}