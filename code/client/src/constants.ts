// #region Public Routes

export const PUBLIC_ROUTES = ['/signup', '/login'];

// #endregion

// #workshop

export const TOOLTIP_TIMEOUT = 2000;

export const TIME_OPTIONS = Array.from({ length: 36 }, (_, i) => {
  const hours = 9 + Math.floor(i / 4);
  const minutes = (i % 4) * 15;

  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  const value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  const label = date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return { label, value };
});

export const DURATION_OPTIONS = Array.from({ length: 13 }, (_, i) => {
  const minutes = i * 15;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  const label =
    minutes === 0
      ? '0 minutes'
      : `${hours ? `${hours} hr${hours > 1 ? 's' : ''}` : ''}${
          remaining ? ` ${remaining} min` : ''
        }`.trim();

  return { value: minutes, label };
});

// #endregion

// #profilePhoto

export const PROFILE_PHOTO_PLACEHOLDER = 'https://picsum.photos/id/103/200/300';

// #endregion

// #region Calendar

export const calendarCss = `/* Base calendar styling */
.rbc-calendar {
  font-family: 'Inter', sans-serif;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #edf2f7;
  overflow: hidden;
}

/* Time gutter styling */
.rbc-time-gutter {
  font-size: 0.875rem;
  font-weight: 500;
  color: bg-primary;
  background-color: #f9f7fc;
  border-right: 1px solid #e9e3f5;
  padding-right: 0.75rem;
  text-align: right;
}

/* Time column styling */
.rbc-time-column {
  background-color: #ffffff;
}

/* Time slot groups - more subtle grid */
.rbc-timeslot-group {
  min-height: 100px;
  border-bottom: 1px solid #f1f5f9;
}

.rbc-day-slot .rbc-time-slot {
  border-top: 1px dashed #e9e3f5;
}

/* Current time indicator - subtle orange */
.rbc-current-time-indicator {
  background-color: #f26552;
  height: 2px;
  opacity: 0.7;
  z-index: 10;
}

/* Header styling */
.rbc-toolbar-label,
.rbc-header {
  background-color: #221b35;
  font-weight: 600;
  font-size: 1rem;
  padding: 1rem;
  color: #ffffff;
  border: none;
  border-bottom: 1px solid #5d4c7c;
}

/* Button group styling */
.rbc-btn-group {
  margin: 0.5rem;
}

.rbc-btn-group button {
  background-color: #ffffff;
  color: #221b35;
  border: 1px solid #e9e3f5;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;
}

.rbc-btn-group button.rbc-active {
  background-color: #221b35;
  color: #ffffff;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.rbc-btn-group button:hover {
  background-color: #f3effa;
  border-color: #c7b8e6;
}

/* Event block styling - gradient with orange accent */
.rbc-event {
  background: linear-gradient(135deg, #fff1e8 0%, #fff5ee 100%);
  color: #f26552;
  border-left: 4px solid #f26552;
  border-radius: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  transition: transform 0.15s ease;
}

.rbc-event:hover {
  background: linear-gradient(135deg, #ffedd5 0%, #fff1e8 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

/* Event content styling */
.rbc-event-label {
  font-size: .75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #f26552;
  margin-bottom: 0.25rem;
}

.rbc-event-content {
  font-size: 0.875rem;
  line-height: 1.4;
}

/* Time header styling */
.rbc-time-header {
  background-color: #f9f7fc;
  border-bottom: 1px solid #e9e3f5;
}

.rbc-time-header-content {
  border-left: 1px solid #e9e3f5;
}

/* Day/week view background */
.rbc-day-bg {
  background-color: #ffffff;
}

/* Row content - enable if needed but style appropriately */
.rbc-row-content {
  display: block;
  z-index: 4;
}

/* Labels styling */
.rbc-label {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.875rem;
}

/* Resource headers (for multiple resources view) */
.rbc-resource-header {
  background-color: #7e57c2;
  font-weight: 600;
  color: #ffffff;
  padding: 0.75rem;
  border-bottom: 1px solid #221b35;
}

/* Today's highlight */
.rbc-today {
  background-color: #fbf7ff;
}

/* Off-range days (for month view) */
.rbc-off-range {
  color: #c7b8e6;
}

/* Selected time/date slot */
.rbc-slot-selecting {
  background-color: rgba(125, 87, 194, 0.1);
}

/* Selected time/date slot */
.rbc-selected {
  background-color: rgba(249, 115, 22, 0.2);
}

/* Day highlight on hover (for day/week view) */
.rbc-day-slot .rbc-background-event {
  opacity: 0.7;
}
/* Toolbar styling */
.rbc-toolbar {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0;
  background-color: #221b35;
  color: #ffffff;
  border-bottom: 1px solid #5d4c7c;
}

/* Toolbar label (usually month/year display) */
.rbc-toolbar-label {
  flex-grow: 1;
  padding: 0;
  text-align: center;
  font-weight: 600;
  font-size: 1.125rem;
  background-color: transparent;
  border: none;
}

/* Button groups in toolbar */
.rbc-toolbar .rbc-btn-group {
  margin: 0 0.5rem;
}

/* Navigation buttons */
.rbc-toolbar .rbc-btn-group button {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  margin-right: 0.25rem;
  transition: all 0.2s ease;
}

.rbc-toolbar .rbc-btn-group button:last-child {
  margin-right: 0;
}

.rbc-toolbar .rbc-btn-group button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.rbc-toolbar .rbc-btn-group button.rbc-active {
  background-color: #f26552;
  color: #ffffff;
  border-color: #f26552;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Today button specific styling */
.rbc-toolbar button.rbc-active.rbc-today-btn {
  background-color: #f26552;
  border-color: #f26552;
  font-weight: 600;
}

/* View switcher buttons */
.rbc-toolbar .rbc-btn-group + .rbc-btn-group {
  margin-left: 1rem;
}

/* Make toolbar responsive */
@media screen and (max-width: 768px) {
  .rbc-toolbar {
    flex-direction: column;
    padding: 0.75rem;
  }
  
  .rbc-toolbar-label {
    margin: 0.5rem 0;
    order: -1;
  }
  
  .rbc-toolbar .rbc-btn-group {
    margin: 0.25rem 0;
  }
  
  .rbc-toolbar .rbc-btn-group + .rbc-btn-group {
    margin-left: 0;
    margin-top: 0.5rem;
  }
} 

/* Agenda view container */
.rbc-agenda-view {
  border-radius: 0.375rem;
  overflow: hidden;
  border: 1px solid #edf2f7;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Agenda header row */
.rbc-agenda-table th {
  background-color: #221b35;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  border-bottom: none;
}

/* Agenda table header row dividers */
.rbc-agenda-table thead > tr > th {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.rbc-agenda-table thead > tr > th:last-child {
  border-right: none;
}

/* Date cell styling */
.rbc-agenda-date-cell {
  font-weight: 600;
  color: #221b35;
  padding: 1rem;
  background-color: #f9f7fc;
  border-bottom: 1px solid #e9e3f5;
}

/* Time cell styling */
.rbc-agenda-time-cell {
  font-size: 0.875rem;
  color: #5d4c7c;
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  border-right: 1px solid #f1f5f9;
  white-space: nowrap;
  width: 120px;
}

/* Event cell styling */
.rbc-agenda-event-cell {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.15s ease;
}

/* Event cell hover effect */
.rbc-agenda-event-cell:hover {
  background-color: #fff8f4;
  cursor: pointer;
}

/* Event content styling */
.rbc-agenda-event-cell a {
  color: #c2410c;
  font-weight: 500;
  text-decoration: none;
  padding-left: 0.5rem;
  border-left: 3px solid #f26552;
  display: block;
  transition: all 0.15s ease;
}

.rbc-agenda-event-cell a:hover {
  color: #ea580c;
  padding-left: 0.75rem;
}

/* Empty cells */
.rbc-agenda-empty {
  padding: 2.5rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
  font-style: italic;
  background-color: #f9fafb;
  border-bottom: 1px solid #f1f5f9;
}

/* Row dividers */
.rbc-agenda-table tbody > tr {
  border-bottom: 1px solid #f1f5f9;
}

/* Last row special styling */
.rbc-agenda-table tbody > tr:last-child > td {
  border-bottom: none;
}

/* Today's row highlight */
.rbc-agenda-table tbody > tr.rbc-today {
  background-color: #fff8f4;
}

/* Agenda view time range header */
.rbc-agenda-view .rbc-agenda-time-range {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #221b35;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Overflow indicator - shows when content scrolls */
.rbc-agenda-view:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0));
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.rbc-agenda-view.scrolling:after {
  opacity: 1;
}

/* Responsive adjustments for smaller screens */
@media screen and (max-width: 768px) {
  .rbc-agenda-table {
    font-size: 0.875rem;
  }
  
  .rbc-agenda-time-cell {
    width: 80px;
    padding: 0.75rem;
  }
  
  .rbc-agenda-date-cell, 
  .rbc-agenda-event-cell {
    padding: 0.75rem;
  }
  
  .rbc-agenda-table th {
    padding: 0.75rem;
    font-size: 0.75rem;
  }
}

.rbc-agenda-view {
  position: relative !important; /* Override absolute positioning */
  height: 100% !important; /* Use full container height */
  overflow-y: auto !important; /* Force vertical scrollbar */
}

/* Ensure the agenda content can scroll */
.rbc-agenda-content {
  height: auto !important;
  min-height: 0 !important;
}

/* Fix agenda table layout */
.rbc-agenda-table {
  width: 100%;
}
`;

// #endregion
