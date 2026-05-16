package buy_book.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    int code;
    String message;
    T result;

    @JsonProperty("data")
    public T getData() {
        return result;
    }

    @JsonProperty("data")
    public void setData(T data) {
        this.result = data;
    }
}
