import { type DateRange } from "react-day-picker";
import { Calendar as Cal } from "lucide-react"
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export function DatePicker({ value, onChange }: {
  value?: DateRange
  onChange: (value?: DateRange) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date-picker"
          className="w-48 justify-between font-normal"
        >
          {value?.from
            ? value.from.toLocaleDateString() + (value?.to ? " - " + value.to.toLocaleDateString() : "")
            : "Chọn thời gian"}
          <Cal className="mr-1 h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}
