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

@Measurement(name = "beico11")
public class Beico {

    @Column(timestamp = true)
    @CsvCustomBindByName(column = "datetime", converter = EpochConverter.class)
    private Instant datetime;

    @Column
    @CsvBindByName(column = "Grd_Prod_Pwr_avg")
    private double Grd_Prod_Pwr_avg;

    @Column
    @CsvBindByName(column = "Amb_Temp_avg")
    private double Amb_Temp_avg;

    @Column
    @CsvBindByName(column = "Amb_WindSpeed_avg")
    private double Amb_WindSpeed_avg;

    @Column
    @CsvBindByName(column = "Grd_Prod_Pwr_min")
    private double Grd_Prod_Pwr_min;

    @Column
    @CsvBindByName(column = "Amb_Temp_min")
    private double Amb_Temp_min;

    @Column
    @CsvBindByName(column = "Amb_WindSpeed_min")
    private double Amb_WindSpeed_min;

    @Column
    @CsvBindByName(column = "Grd_Prod_Pwr_max")
    private double Grd_Prod_Pwr_max;

    @Column
    @CsvBindByName(column = "Amb_Temp_max")
    private double Amb_Temp_max;

    @Column
    @CsvBindByName(column = "Amb_WindSpeed_max")
    private double Amb_WindSpeed_max;

    @Column
    @CsvBindByName(column = "Grd_Prod_Pwr_std")
    private double Grd_Prod_Pwr_std;

    @Column
    @CsvBindByName(column = "Amb_WindSpeed_std")
    private double Amb_WindSpeed_std;

    @Column
    @CsvBindByName(column = "Amb_WindDir_Abs_avg")
    private double Amb_WindDir_Abs_avg;

    @Column
    @CsvBindByName(column = "label")
    private double label;

    @Column
    @CsvBindByName(column = "MeanWindSpeedUID_10_0m")
    private double MeanWindSpeedUID_10_0m;

    @Column
    @CsvBindByName(column = "DirectionUID_10_0m")
    private double DirectionUID_10_0m;

    @Column
    @CsvBindByName(column = "MeanWindSpeedUID_100_0m")
    private double MeanWindSpeedUID_100_0m;

    @Column
    @CsvBindByName(column = "DirectionUID_100_0m")
    private double DirectionUID_100_0m;

    public Point toPoint() {
        return Point.measurement("beico11")
                .time(datetime, WritePrecision.NS)
                .addField("Grd_Prod_Pwr_avg", Grd_Prod_Pwr_avg)
                .addField("Amb_Temp_avg", Amb_Temp_avg)
                .addField("Amb_WindSpeed_avg", Amb_WindSpeed_avg)
                .addField("Grd_Prod_Pwr_min", Grd_Prod_Pwr_min)
                .addField("Amb_Temp_min", Amb_Temp_min)
                .addField("Amb_WindSpeed_min", Amb_WindSpeed_min)
                .addField("Grd_Prod_Pwr_max", Grd_Prod_Pwr_max)
                .addField("Amb_Temp_max", Amb_Temp_max)
                .addField("Amb_WindSpeed_max", Amb_WindSpeed_max)
                .addField("Grd_Prod_Pwr_std", Grd_Prod_Pwr_std)
                .addField("Amb_WindSpeed_std", Amb_WindSpeed_std)
                .addField("Amb_WindDir_Abs_avg", Amb_WindDir_Abs_avg)
                .addField("label", label)
                .addField("MeanWindSpeedUID_10.0m", MeanWindSpeedUID_10_0m)
                .addField("DirectionUID_10.0m", DirectionUID_10_0m)
                .addField("MeanWindSpeedUID_100.0m", MeanWindSpeedUID_100_0m)
                .addField("DirectionUID_100.0m", DirectionUID_100_0m);
    }
    

    public Beico (Instant datetime, double Grd_Prod_Pwr_avg, double Amb_Temp_avg, double Amb_WindSpeed_avg,
                       double Grd_Prod_Pwr_min, double Amb_Temp_min, double Amb_WindSpeed_min,
                       double Grd_Prod_Pwr_max, double Amb_Temp_max, double Amb_WindSpeed_max,
                       double Grd_Prod_Pwr_std, double Amb_WindSpeed_std, double Amb_WindDir_Abs_avg,
                       double label, double MeanWindSpeedUID_10_0m, double DirectionUID_10_0m,
                       double MeanWindSpeedUID_100_0m, double DirectionUID_100_0m) {
        this.datetime = datetime;
        this.Grd_Prod_Pwr_avg = Grd_Prod_Pwr_avg;
        this.Amb_Temp_avg = Amb_Temp_avg;
        this.Amb_WindSpeed_avg = Amb_WindSpeed_avg;
        this.Grd_Prod_Pwr_min = Grd_Prod_Pwr_min;
        this.Amb_Temp_min = Amb_Temp_min;
        this.Amb_WindSpeed_min = Amb_WindSpeed_min;
        this.Grd_Prod_Pwr_max = Grd_Prod_Pwr_max;
        this.Amb_Temp_max = Amb_Temp_max;
        this.Amb_WindSpeed_max = Amb_WindSpeed_max;
        this.Grd_Prod_Pwr_std = Grd_Prod_Pwr_std;
        this.Amb_WindSpeed_std = Amb_WindSpeed_std;
        this.Amb_WindDir_Abs_avg = Amb_WindDir_Abs_avg;
        this.label = label;
        this.MeanWindSpeedUID_10_0m = MeanWindSpeedUID_10_0m;
        this.DirectionUID_10_0m = DirectionUID_10_0m;
        this.MeanWindSpeedUID_100_0m = MeanWindSpeedUID_100_0m;
        this.DirectionUID_100_0m = DirectionUID_100_0m;
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
        return "Beico [datetime=" + datetime + ", Grd_Prod_Pwr_avg=" + Grd_Prod_Pwr_avg + ", Amb_Temp_avg="
                + Amb_Temp_avg + ", Amb_WindSpeed_avg=" + Amb_WindSpeed_avg + ", Grd_Prod_Pwr_min=" + Grd_Prod_Pwr_min
                + ", Amb_Temp_min=" + Amb_Temp_min + ", Amb_WindSpeed_min=" + Amb_WindSpeed_min + ", Grd_Prod_Pwr_max="
                + Grd_Prod_Pwr_max + ", Amb_Temp_max=" + Amb_Temp_max + ", Amb_WindSpeed_max=" + Amb_WindSpeed_max
                + ", Grd_Prod_Pwr_std=" + Grd_Prod_Pwr_std + ", Amb_WindSpeed_std=" + Amb_WindSpeed_std
                + ", Amb_WindDir_Abs_avg=" + Amb_WindDir_Abs_avg + ", label=" + label + ", MeanWindSpeedUID_10_0m="
                + MeanWindSpeedUID_10_0m + ", DirectionUID_10_0m=" + DirectionUID_10_0m + ", MeanWindSpeedUID_100_0m="
                + MeanWindSpeedUID_100_0m + ", DirectionUID_100_0m=" + DirectionUID_100_0m + "]";
    }

}
