/*
 * Created with @iobroker/create-adapter v1.34.1
 */

import * as utils from '@iobroker/adapter-core';
//lib for http get
import axios from 'axios';

class Aio extends utils.Adapter {

    private polltime = 0;
    private ip = '';
    private adapterIntervals: any; //halten von allen Intervallen

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'aio',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {

        // debug
        this.log.debug('Config ist set to:');

        this.log.debug('IP:' +  this.config.ip);
        this.log.debug('Polltime:' + this.config.polltime);


        //Püfen die übergabe der IP
        if(this.config.ip) {
            if( this.config.ip != '0.0.0.0' && this.config.ip != '') {
                this.config.ip = this.config.ip.replace('http', '');
                this.config.ip = this.config.ip.replace('://', '');
                //this.config.ip = this.config.ip.replace('/', '');
                this.ip = this.config.ip;
                this.log.debug('Final Ip:' + this.ip);
            } else {
                this.log.error('No ip is set, adapter stop')
                return;
            }
        } else {
            this.log.error('No ip is set, adapter stop')
            return;
        }

        //Prüfen Polltime
        if(this.config.polltime > 0) {
            this.polltime = this.config.polltime;
        } else {
            this.log.error('Wrong Polltime (polltime < 0), adapter stop')
            return;
        }

        //War alles ok, dann können wir die Daten abholen
        this.adapterIntervals = this.setInterval(() => this.getIntervallData(), this.polltime * 1000);
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private onUnload(callback: () => void): void {
        try {
            clearInterval(this.adapterIntervals);
            callback();
        } catch (e) {
            callback();
        }
    }

    private getIntervallData(): void {
        try {
            this.log.debug('call: ' + 'http://' + this.ip + '/R3EMSAPP_REAL.ems?file=ESSRealtimeStatus.json');
            axios('http://' + this.ip + '/R3EMSAPP_REAL.ems?file=ESSRealtimeStatus.json').then( async response => {
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
                this.log.error(error.message)
                this.setState('info.connection', false, true);
            });

            //Hole noch wetterdaten - s/R3EMSAPP_REAL.ems?file=Weather.json&_=1636144519854
            axios('http://' + this.ip + '/R3EMSAPP_REAL.ems?file=Weather.json').then( async response => {
                this.log.debug('Get-Data from inverter:');
                this.log.debug(JSON.stringify(response.data));
                await this.setStateAsync('weather.Time', { val: response.data.WeatherInfo.Time, ack: true });
                await this.setStateAsync('weather.Weather', { val: response.data.WeatherInfo.Weather, ack: true });
                await this.setStateAsync('weather.CloudAll', { val: response.data.WeatherInfo.CloudAll, ack: true });
                await this.setStateAsync('weather.TempUnit', { val: response.data.WeatherInfo.TempUnit, ack: true });
                await this.setStateAsync('weather.Temperature', { val: response.data.WeatherInfo.Temperature, ack: true });
                await this.setStateAsync('weather.Humidity', { val: response.data.WeatherInfo.Humidity, ack: true });
                await this.setStateAsync('weather.WindDirection', { val: response.data.WeatherInfo.WindDirection, ack: true });
                await this.setStateAsync('weather.WindSpeed', { val: response.data.WeatherInfo.WindSpeed, ack: true });

                this.setState('info.connection', true, true);
            }).catch(error => {
                this.log.error(error.message)
                this.setState('info.connection', false, true);
            });
        } catch (error: unknown) {
            this.setState('info.connection', false, true);
            if (typeof error === 'string') {
                this.log.error(error);
            } else if (error instanceof Error) {
                this.log.error(error.message);
            }
        }
    }
}
if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new Aio(options);
} else {
    // otherwise start the instance directly
    (() => new Aio())();
}