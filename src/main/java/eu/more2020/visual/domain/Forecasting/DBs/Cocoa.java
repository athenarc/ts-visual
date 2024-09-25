package eu.more2020.visual.domain.Forecasting.DBs;

import com.influxdb.annotations.Column;
import com.influxdb.annotations.Measurement;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.opencsv.bean.AbstractBeanField;
import com.opencsv.bean.CsvBindByName;
import com.opencsv.bean.CsvCustomBindByName;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Date;

@Measurement(name = "cocoa")
public class Cocoa {

    @Column(timestamp = true)
    @CsvCustomBindByName(column = "timestamp", converter = EpochConverter.class)
    private Instant timestamp;

    @Column
    @CsvBindByName(column = "irradiance")
    private double irradiance;

    @Column
    @CsvBindByName(column = "mod_temp")
    private double mod_temp;

    @Column
    @CsvBindByName(column = "Shortcircuitcurrent")
    private double shortCircuitCurrent;

    @Column
    @CsvBindByName(column = "power")
    private double power;

    @Column
    @CsvBindByName(column = "dcurrent")
    private double dcurrent;

    @Column
    @CsvBindByName(column = "Voltageatmax")
    private double voltageAtMax;

    @Column
    @CsvBindByName(column = "Opencircuitvoltage")
    private double openCircuitVoltage;

    @Column
    @CsvBindByName(column = "humidity")
    private double humidity;

    @Column
    @CsvBindByName(column = "precipitation")
    private double precipitation;

    @Column
    @CsvBindByName(column = "dni")
    private double dni;

    @Column
    @CsvBindByName(column = "ghi")
    private double ghi;

    @Column
    @CsvBindByName(column = "dhi")
    private double dhi;

    @Column
    @CsvBindByName(column = "soiling_derate")
    private double soilingDerate;

    public Point toPoint() {
        return Point.measurement("cocoa")
                .time(timestamp, WritePrecision.NS)
                .addField("irradiance", irradiance)
                .addField("mod_temp", mod_temp)
                .addField("Shortcircuitcurrent", shortCircuitCurrent)
                .addField("power", power)
                .addField("dcurrent", dcurrent)
                .addField("Voltageatmax", voltageAtMax)
                .addField("Opencircuitvoltage", openCircuitVoltage)
                .addField("humidity", humidity)
                .addField("precipitation", precipitation)
                .addField("dni", dni)
                .addField("ghi", ghi)
                .addField("dhi", dhi)
                .addField("soiling_derate", soilingDerate);
    }

    public Cocoa(Instant timestamp, double irradiance, double mod_temp, double shortCircuitCurrent,
                 double power, double dcurrent, double voltageAtMax, double openCircuitVoltage,
                 double humidity, double precipitation, double dni, double ghi, double dhi,
                 double soilingDerate) {
        this.timestamp = timestamp;
        this.irradiance = irradiance;
        this.mod_temp = mod_temp;
        this.shortCircuitCurrent = shortCircuitCurrent;
        this.power = power;
        this.dcurrent = dcurrent;
        this.voltageAtMax = voltageAtMax;
        this.openCircuitVoltage = openCircuitVoltage;
        this.humidity = humidity;
        this.precipitation = precipitation;
        this.dni = dni;
        this.ghi = ghi;
        this.dhi = dhi;
        this.soilingDerate = soilingDerate;
    }

    public static class EpochConverter extends AbstractBeanField {

        @Override
        public Instant convert(String s) {
            try {
                String format = "yyyy-MM-dd HH:mm:ss";
                SimpleDateFormat sdf = new SimpleDateFormat(format);
                Date date = sdf.parse(s);
                return date.toInstant();
            } catch (ParseException e) {
                e.printStackTrace();
            }
            return null;
        }
    }

    @Override
    public String toString() {
        return "Cocoa [timestamp=" + timestamp + ", irradiance=" + irradiance + ", mod_temp="
                + mod_temp + ", shortCircuitCurrent=" + shortCircuitCurrent + ", power=" + power
                + ", dcurrent=" + dcurrent + ", voltageAtMax=" + voltageAtMax + ", openCircuitVoltage="
                + openCircuitVoltage + ", humidity=" + humidity + ", precipitation=" + precipitation
                + ", dni=" + dni + ", ghi=" + ghi + ", dhi=" + dhi + ", soilingDerate=" + soilingDerate + "]";
    }
}
