export async function createGoogleEvent(task: {
    title: string;
    description?: string;
    date?: string | Date | null;
    endDate?: string |Date | null;
    allDay?: boolean;
    location?: boolean;
}){
    const token = localStorage.getItem("google_access_token");
    if(!token) throw new Error("No google access token");

    const toISO = (d?: string |Date| null) => (d? new Date(d).toISOString() : null);
    const toYYYYMMDD = (d?: string | Date | null) => {
        if(!d) return null;
        const newDate = new Date(d);
        const y = newDate.getFullYear();
        const m = String(newDate.getMonth() +1).padStart(2, "0");
        const dd = String(newDate.getDate()).padStart(2, "0");
        return '${y}-${m}-${dd}';
    };

    const toDateObj = (d?: string | Date | null): Date | null => {
        if (!d) return null;
        const dt = d instanceof Date ? new Date(d.getTime()) : new Date(d);
        return isNaN(dt.getTime()) ? null : dt;
    };
    
    let body: any;
    if (task.allDay) {
        const start = toYYYYMMDD(task.date);
        const endDateObj = task.endDate ? new Date(task.endDate) : new Date(task.date || Date.now());
        // Google all-day end.date is exclusive; add one day
        endDateObj.setDate(endDateObj.getDate() + 1);
        const end = toYYYYMMDD(endDateObj);

        body = {
            summary: task.title,
            description: task.description ?? "",
            start: { date: start },
            end: { date: end },
            location: task.location ?? "",
        };
    } else {
        let startDt = toDateObj(task.date) ?? new Date();;
        let endDt = toDateObj(task.endDate) ?? null;

        if (startDt.getHours() === 0 && startDt.getMinutes() === 0 && startDt.getSeconds() === 0){
            startDt.setHours(9, 0, 0, 0); //set to nine am if no start date
        }

        if(endDt == null){
            endDt = new Date(startDt.getTime() + 60 *60+1000);
        }
        const startIso = toISO(startDt);
        const endIso = toISO(endDt);
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        body = {
            summary: task.title,
            description: task.description ?? "",
            start: { dateTime: startIso, timeZone },
            end: { dateTime: endIso, timeZone },
            location: task.location ?? "",
        };
    }
    const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST", 
        headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json", 
        }, 
        body: JSON.stringify(body),
    });
    if(!res.ok){
        const txt = await res.text();
        throw new Error(`Google calendar API error: ${res.status} ${txt}` );

    }
    return res.json();
}
