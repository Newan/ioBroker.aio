"use strict";
/*
 * Created with @iobroker/create-adapter v1.33.0
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
// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = __importStar(require("@iobroker/adapter-core"));
const axios_1 = __importDefault(require("axios"));
// Load your modules here, e.g.:
// import * as fs from "fs";
class Aio extends utils.Adapter {
    constructor(options = {}) {
        super({
            ...options,
            name: 'aio',
        });
        this.adapterIntervals = {}; //halten von allen Intervallen
        this.url = '';
        this.polltime = 30;
        this.on('ready', this.onReady.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }
    async setAioObject() {
        await this.setObjectNotExistsAsync('ColecTm', {
            type: 'state',
            common: {
                name: 'ColecTm',
                type: 'number',
                role: 'value',
                read: true,
                write: false,
            },
            native: {},
        });
        await this.setObjectNotExistsAsync('PowerOutletPw', {
            type: 'state',
            common: {
                name: 'PowerOutletPw',
                type: 'number',
                role: 'value',
                read: true,
                write: false,
            },
            native: {},
        });
        await this.setObjectNotExistsAsync('GridPw', {
            type: 'state',
            common: {
                name: 'GridPw',
                type: 'number',
                role: 'value',
                read: true,
                write: false,
            },
            native: {},
        });
        await this.setObjectNotExistsAsync('UnitPrice', {
            type: 'state',
            common: {
                name: 'UnitPrice',
                type: 'number',
                role: 'value',
                read: true,
                write: false,
            },
            native: {},
        });
        await this.setObjectNotExistsAsync('ConsPw', {
            type: 'state',
            common: {
                name: 'ConsPw',
                type: 'number',
                role: 'value',
                read: true,
                write: false,
            },
            native: {},
        });
        await this.setObjectNotExistsAsync('BtSoc', {
            type: 'state',
            common: {
                name: 'BtSoc',
                type: 'number',
                role: 'value',
                read: true,
                write: false,
            },
            native: {},
        });
        await this.setObjectNotExistsAsync('PcsPw', {
            type: 'state',
            common: {
                name: 'PcsPw',
                type: 'number',
                role: 'value',
                read: true,
                write: false,
            },
            native: {},
        });
        await this.setObjectNotExistsAsync('AbsPcsPw', {
            type: 'state',
            common: {
                name: 'AbsPcsPw',
                type: 'number',
                role: 'value',
                read: true,
                write: false,
            },
            native: {},
        });
        await this.setObjectNotExistsAsync('PvPw', {
            type: 'state',
            common: {
                name: 'PvPw',
                type: 'number',
                role: 'value',
                read: true,
                write: false,
            },
            native: {},
        });
        await this.setObjectNotExistsAsync('GridStusCd', {
            type: 'state',
            common: {
                name: 'GridStusCd',
                type: 'number',
                role: 'value',
                read: true,
                write: false,
            },
            native: {},
        });
        await this.setObjectNotExistsAsync('BtStusCd', {
            type: 'state',
            common: {
                name: 'BtStusCd',
                type: 'number',
                role: 'value',
                read: true,
                write: false,
            },
            native: {},
        });
        await this.setObjectNotExistsAsync('BtPw', {
            type: 'state',
            common: {
                name: 'BtPw',
                type: 'number',
                role: 'value',
                read: true,
                write: false,
            },
            native: {},
        });
        await this.setObjectNotExistsAsync('OperStusCd', {
            type: 'state',
            common: {
                name: 'OperStusCd',
                type: 'number',
                role: 'value',
                read: true,
                write: false,
            },
            native: {},
        });
        await this.setObjectNotExistsAsync('EmsOpMode', {
            type: 'state',
            common: {
                name: 'EmsOpMode',
                type: 'number',
                role: 'value',
                read: true,
                write: false,
            },
            native: {},
        });
        await this.setObjectNotExistsAsync('RankPer', {
            type: 'state',
            common: {
                name: 'RankPer',
                type: 'number',
                role: 'value',
                read: true,
                write: false,
            },
            native: {},
        });
        await this.setObjectNotExistsAsync('ErrorCnt', {
            type: 'state',
            common: {
                name: 'ErrorCnt',
                type: 'number',
                role: 'value',
                read: true,
                write: false,
            },
            native: {},
        });
    }
    startIntervall() {
        try {
            axios_1.default(this.url + '/R3EMSAPP_REAL.ems?file=ESSRealtimeStatus.json').then(async (response) => {
                this.log.debug(JSON.stringify(response.data));
                /*
                "ColecTm":"20210504222840",
                "PowerOutletPw":"0",
                "GridPw":0.07,
                "UnitPrice":0.00,
                "ConsPw":0.70,
                "BtSoc":73,
                "PcsPw":623.00,
                "AbsPcsPw":0.62,
                "PvPw":0.00,
                "GridStusCd":"0",
                "BtStusCd":"0",
                "BtPw":0.67,
                "OperStusCd":"0",
                "EmsOpMode":"0",
                "RankPer":0,
                "ErrorCnt":0
                */
                await this.setStateAsync('ColecTm', { val: response.data.ESSRealtimeStatus.ColecTm, ack: true });
                await this.setStateAsync('PowerOutletPw', { val: response.data.ESSRealtimeStatus.PowerOutletPw, ack: true });
                await this.setStateAsync('GridPw', { val: response.data.ESSRealtimeStatus.GridPw, ack: true });
                await this.setStateAsync('UnitPrice', { val: response.data.ESSRealtimeStatus.UnitPrice, ack: true });
                await this.setStateAsync('ConsPw', { val: response.data.ESSRealtimeStatus.ConsPw, ack: true });
                await this.setStateAsync('BtSoc', { val: response.data.ESSRealtimeStatus.BtSoc, ack: true });
                await this.setStateAsync('PcsPw', { val: response.data.ESSRealtimeStatus.PcsPw, ack: true });
                await this.setStateAsync('AbsPcsPw', { val: response.data.ESSRealtimeStatus.AbsPcsPw, ack: true });
                await this.setStateAsync('PvPw', { val: response.data.ESSRealtimeStatus.PvPw, ack: true });
                await this.setStateAsync('GridStusCd', { val: response.data.ESSRealtimeStatus.GridStusCd, ack: true });
                await this.setStateAsync('BtStusCd', { val: response.data.ESSRealtimeStatus.BtStusCd, ack: true });
                await this.setStateAsync('BtPw', { val: response.data.ESSRealtimeStatus.BtPw, ack: true });
                await this.setStateAsync('OperStusCd', { val: response.data.ESSRealtimeStatus.OperStusCd, ack: true });
                await this.setStateAsync('EmsOpMode', { val: response.data.ESSRealtimeStatus.EmsOpMode, ack: true });
                await this.setStateAsync('RankPer', { val: response.data.ESSRealtimeStatus.RankPer, ack: true });
                await this.setStateAsync('ErrorCnt', { val: response.data.ESSRealtimeStatus.ErrorCnt, ack: true });
                this.setState('info.connection', true, true);
            }).catch(error => {
                this.log.error(error.message);
                this.setState('info.connection', false, true);
            });
        }
        catch (error) {
            this.setState('info.connection', false, true);
            this.log.error(error.message);
        }
        this.adapterIntervals = setTimeout(this.startIntervall.bind(this), this.polltime * 1000);
    }
    async onReady() {
        // Initialize your adapter here
        if (this.config.polltime > 0) {
            this.polltime = this.config.polltime;
            if (this.config.url != '') {
                this.url = this.config.url;
                this.log.debug('create AIO Objects');
                this.setAioObject().then(() => {
                    this.log.debug('start AIO Intervall');
                    this.startIntervall();
                });
            }
            else {
                console.log('No URL to AIO Portal set');
            }
        }
        else {
            //Polltime zu klein
            this.log.error('Polltime to small');
        }
    }
    onUnload(callback) {
        try {
            //clearTimeout(adapterIntervals.readAllStates);
            this.log.info('Adaptor aio cleaned up everything...');
            this.setState('info.connection', false, true);
            callback();
        }
        catch (e) {
            callback();
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
