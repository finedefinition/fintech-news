import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the CSS for the date-picker component
import './NewsComponent.css';

const NewsComponent = () => {
    const [newsData, setNewsData] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedTicket, setSelectedTicket] = useState('');
    const [ticketsList, setTicketsList] = useState([
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'FB', 'TSLA', 'BRK.A', 'JPM',
        'V', 'JNJ', 'WMT', 'PG', 'UNH', 'MA', 'NVDA', 'HD', 'BAC',
        'PFE', 'DIS', 'VZ'
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // You can set this to any number you want for items per page

    // Derived state for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = newsData.slice(indexOfFirstItem, indexOfLastItem);

    // Function to change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (selectedTicket) {
                    const response = await fetch(
                        `https://api.polygon.io/v2/reference/news?ticker=${selectedTicket}&apiKey=KPcpXIk3tqCf5HBomDdRTQR2WTTFUDXy&published_utc.gt=${startDate.toISOString()}&published_utc.lt=${endDate.toISOString()}`
                    );
                    const data = await response.json();
                    setNewsData(data.results);
                }
            } catch (error) {
                console.error('Error fetching news data:', error);
            }
        };

        fetchData();
    }, [startDate, endDate, selectedTicket]);

    const handleTicketChange = (event) => {
        setSelectedTicket(event.target.value);
    };

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(newsData.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="news-container">
            <div className="ticket-selector">
                <label htmlFor="ticket-select">Choose a ticker:</label>
                <select id="ticket-select" value={selectedTicket} onChange={handleTicketChange}>
                    <option value="">Select a ticker</option>
                    {ticketsList.map((ticket) => (
                        <option key={ticket} value={ticket}>{ticket}</option>
                    ))}
                </select>
            </div>
            <div className="date-picker-container">
                <label htmlFor="start-date-picker">Pick up the date:</label>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="MM/dd/yyyy"
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="MM/dd/yyyy"
                />
            </div>
            <div className="news-items">
                {currentItems.map((news) => (
                    <div key={news.id} className="news-item">
                        <img src={news.publisher.logo_url} alt={news.publisher.name} className="news-logo"/>
                        <div className="news-content">
                            <h3 className="news-title">{news.title}</h3>
                            <p className="news-author">
                                <strong>Author:</strong> {news.author}
                            </p>
                            <p className="news-published">
                                <strong>Published UTC:</strong> {new Date(news.published_utc).toLocaleString()}
                            </p>
                            <p className="news-description">
                                {news.description}
                            </p>
                        </div>
                        <a href={news.article_url} className="news-read-more" target="_blank" rel="noopener noreferrer">
                            Read More
                        </a>
                    </div>
                ))}
            </div>
            <div className="pagination">
                {pageNumbers.map(number => (
                    <button key={number} onClick={() => paginate(number)}
                            className={currentPage === number ? 'active' : ''}>
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default NewsComponent;
