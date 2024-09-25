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

@Measurement(name = "bebeze")
public class Bebeze {

    @Column(timestamp = true)
    @CsvCustomBindByName(column = "datetime", converter = EpochConverter.class)
    private Instant datetime;

    @Column
    @CsvBindByName(column = "active_power")
    private Double active_power;

    @Column
    @CsvBindByName(column = "roto_speed")
    private Double roto_speed;

    @Column
    @CsvBindByName(column = "wind_speed")
    private Double wind_speed;

    @Column
    @CsvBindByName(column = "cos_nacelle_dir")
    private Double cos_nacelle_dir;

    @Column
    @CsvBindByName(column = "pitch_angle")
    private Double pitch_angle;

    @Column
    @CsvBindByName(column = "sin_nacelle_dir")
    private Double sin_nacelle_dir;

    @Column
    @CsvBindByName(column = "cos_wind_dir")
    private Double cos_wind_dir;

    @Column
    @CsvBindByName(column = "sin_wind_dir")
    private Double sin_wind_dir;

    @Column
    @CsvBindByName(column = "nacelle_direction")
    private Double nacelle_direction;

    @Column
    @CsvBindByName(column = "wind_direction")
    private Double wind_direction;

    public Point toPoint() {
        return Point.measurement("bebeze")
                .time(datetime, WritePrecision.NS)
                .addField("active_power", active_power)
                .addField("roto_speed", roto_speed)
                .addField("wind_speed", wind_speed)
                .addField("cos_nacelle_dir", cos_nacelle_dir)
                .addField("pitch_angle", pitch_angle)
                .addField("sin_nacelle_dir", sin_nacelle_dir)
                .addField("cos_wind_dir", cos_wind_dir)
                .addField("sin_wind_dir", sin_wind_dir)
                .addField("nacelle_direction", nacelle_direction)
                .addField("wind_direction", wind_direction);
    }

    public Bebeze(Instant datetime, Double active_power, Double roto_speed, Double wind_speed, Double cos_nacelle_dir,
            Double pitch_angle, Double sin_nacelle_dir, Double cos_wind_dir, Double sin_wind_dir,
            Double nacelle_direction, Double wind_direction) {
        this.datetime = datetime;
        this.active_power = active_power;
        this.roto_speed = roto_speed;
        this.wind_speed = wind_speed;
        this.cos_nacelle_dir = cos_nacelle_dir;
        this.pitch_angle = pitch_angle;
        this.sin_nacelle_dir = sin_nacelle_dir;
        this.cos_wind_dir = cos_wind_dir;
        this.sin_wind_dir = sin_wind_dir;
        this.nacelle_direction = nacelle_direction;
        this.wind_direction = wind_direction;
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
        return "Bebeze [datetime=" + datetime + ", active_power=" + active_power + ", roto_speed=" + roto_speed
                + ", wind_speed=" + wind_speed + ", cos_nacelle_dir=" + cos_nacelle_dir + ", pitch_angle=" + pitch_angle
                + ", sin_nacelle_dir=" + sin_nacelle_dir + ", cos_wind_dir=" + cos_wind_dir + ", sin_wind_dir="
                + sin_wind_dir + ", nacelle_direction=" + nacelle_direction + ", wind_direction=" + wind_direction
                + "]";
    }

}
