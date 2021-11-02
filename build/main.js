"use strict";
/*
 * Created with @iobroker/create-adapter v1.34.1
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils = __importStar(require("@iobroker/adapter-core"));
//lib for http get
const axios_1 = __importDefault(require("axios"));
class Aio extends utils.Adapter {
    constructor(options = {}) {
        super({
            ...options,
            name: 'aio',
        });
        this.polltime = 0;
        this.ip = '';
        this.on('ready', this.onReady.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }
    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        // debug
        this.log.debug('Config ist set to:');
        this.log.debug('IP:' + this.config.ip);
        this.log.debug('Polltime:' + this.config.polltime);
        //Püfen die übergabe der IP
        if (this.config.ip) {
            if (this.config.ip != '0.0.0.0' && this.config.ip != '') {
                this.config.ip = this.config.ip.replace('http', '');
                this.config.ip = this.config.ip.replace(':', '');
                this.config.ip = this.config.ip.replace('/', '');
                this.ip = this.config.ip;
                this.log.debug('Final Ip:' + this.ip);
            }
            else {
                this.log.error('No ip is set, adapter stop');
                return;
            }
        }
        else {
            this.log.error('No ip is set, adapter stop');
            return;
        }
        //Prüfen Polltime
        if (this.config.polltime > 0) {
            this.polltime = this.config.polltime;
        }
        else {
            this.log.error('Wrong Polltime (polltime < 0), adapter stop');
            return;
        }
        //War alles ok, dann können wir die Daten abholen
        this.adapterIntervals = this.setInterval(() => this.getIntervallData(), this.polltime * 1000);
    }
    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    onUnload(callback) {
        try {
            clearInterval(this.adapterIntervals);
            callback();
        }
        catch (e) {
            callback();
        }
    }
    getIntervallData() {
        try {
            this.log.debug('call: ' + 'http://' + this.ip + '/R3EMSAPP_REAL.ems?file=ESSRealtimeStatus.json');
            (0, axios_1.default)('http://' + this.ip + '/R3EMSAPP_REAL.ems?file=ESSRealtimeStatus.json').then(async (response) => {
                this.log.debug('Get-Data from inverter:');
                this.log.debug(JSON.stringify(response.data));
                await this.setStateAsync('status.ColecTm', { val: response.data.ESSRealtimeStatus.ColecTm, ack: true });
                await this.setStateAsync('status.PowerOutletPw', { val: response.data.ESSRealtimeStatus.PowerOutletPw, ack: true });
                await this.setStateAsync('status.GridPw', { val: response.data.ESSRealtimeStatus.GridPw, ack: true });
                await this.setStateAsync('status.UnitPrice', { val: response.data.ESSRealtimeStatus.UnitPrice, ack: true });
                await this.setStateAsync('status.ConsPw', { val: response.data.ESSRealtimeStatus.ConsPw, ack: true });
                await this.setStateAsync('status.BtSoc', { val: response.data.ESSRealtimeStatus.BtSoc, ack: true });
                await this.setStateAsync('status.PcsPw', { val: response.data.ESSRealtimeStatus.PcsPw, ack: true });
                await this.setStateAsync('status.AbsPcsPw', { val: response.data.ESSRealtimeStatus.AbsPcsPw, ack: true });
                await this.setStateAsync('status.PvPw', { val: response.data.ESSRealtimeStatus.PvPw, ack: true });
                await this.setStateAsync('status.GridStusCd', { val: response.data.ESSRealtimeStatus.GridStusCd, ack: true });
                await this.setStateAsync('status.BtStusCd', { val: response.data.ESSRealtimeStatus.BtStusCd, ack: true });
                await this.setStateAsync('status.BtPw', { val: response.data.ESSRealtimeStatus.BtPw, ack: true });
                await this.setStateAsync('status.OperStusCd', { val: response.data.ESSRealtimeStatus.OperStusCd, ack: true });
                await this.setStateAsync('status.EmsOpMode', { val: response.data.ESSRealtimeStatus.EmsOpMode, ack: true });
                await this.setStateAsync('status.RankPer', { val: response.data.ESSRealtimeStatus.RankPer, ack: true });
                await this.setStateAsync('status.ErrorCnt', { val: response.data.ESSRealtimeStatus.ErrorCnt, ack: true });
                this.setState('info.connection', true, true);
            }).catch(error => {
                this.log.error(error.message);
                this.setState('info.connection', false, true);
            });
        }
        catch (error) {
            this.setState('info.connection', false, true);
            if (typeof error === 'string') {
                this.log.error(error);
            }
            else if (error instanceof Error) {
                this.log.error(error.message);
            }
        }
    }
}
if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options) => new Aio(options);
}
else {
    // otherwise start the instance directly
    (() => new Aio())();
}
//# sourceMappingURL=main.js.map