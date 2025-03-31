-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 25, 2025 at 10:00 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `datn`
--
CREATE DATABASE IF NOT EXISTS `test-datn` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `test-datn`;

-- --------------------------------------------------------

--
-- Table structure for table `cart_detail`
--

CREATE TABLE `cart_detail` (
  `Cart_Detail_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Product_ID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL CHECK (`Quantity` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `cart_detail`
--

INSERT INTO `cart_detail` (`Cart_Detail_ID`, `User_ID`, `Product_ID`, `Quantity`) VALUES
(1, 1, 1, 2), -- User 1 thêm 2 cuốn "Nàng Juliet ở trường nội trú - Tập 15"
(2, 1, 9, 1), -- User 1 thêm 1 cuốn "Spy X Family - Tập 1"
(3, 2, 4, 3); -- User 2 thêm 3 cuốn "Blue Box - Tập 1"

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `Category_ID` int(11) NOT NULL,
  `Category_Name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`Category_ID`, `Category_Name`) VALUES
(1, 'Manga'),
(2, 'Light Novel'),
(3, 'Tiểu thuyết hiện đại'),
(4, 'Tiểu thuyết kinh điển'),
(5, 'Sách thiếu nhi'),
(6, 'Sách kỹ năng sống'),
(7, 'Sách đời sống và sức khỏe'),
(8, 'Sách chuyên ngành'),
(9, 'Sách tâm lý'),
(10, 'Sách văn học');

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `Comment_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Product_ID` int(11) NOT NULL,
  `Content` text NOT NULL,
  `Comment_Date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`Comment_ID`, `User_ID`, `Product_ID`, `Content`, `Comment_Date`) VALUES
(1, 1, 1, 'Sách rất hay, nội dung cuốn hút!', '2025-03-25 10:00:00'),
(2, 2, 9, 'Spy X Family hài hước và đáng yêu.', '2025-03-25 10:05:00');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `Order_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Voucher_ID` int(11) DEFAULT NULL,
  `Payment_ID` int(11) NOT NULL,
  `Order_date` datetime DEFAULT current_timestamp(),
  `Status` enum('Pending','Completed','Cancelled','Awaiting Shipment','Shipping','Awaiting Delivery') DEFAULT 'Pending',
  `Total_amount` decimal(10,2) NOT NULL,
  `Recipient_Name` varchar(255) NOT NULL,
  `Recipient_Phone` varchar(20) NOT NULL,
  `Recipient_address` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`Order_ID`, `User_ID`, `Voucher_ID`, `Payment_ID`, `Order_date`, `Status`, `Total_amount`, `Recipient_Name`, `Recipient_Phone`, `Recipient_address`) VALUES
(1, 1, 1, 1, '2025-03-25 12:00:00', 'Completed', 53000.00, 'Nguyễn Văn A', '0123456789', '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh'),
(2, 2, NULL, 2, '2025-03-25 12:30:00', 'Pending', 108000.00, 'Trần Thị B', '0987654321', '456 Đường DEF, Quận UVW, Hà Nội');

-- --------------------------------------------------------

--
-- Table structure for table `order_detail`
--

CREATE TABLE `order_detail` (
  `Order_Detail_ID` int(11) NOT NULL,
  `Order_ID` int(11) NOT NULL,
  `Product_ID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL CHECK (`Quantity` > 0),
  `Price` decimal(10,2) NOT NULL CHECK (`Price` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `order_detail`
--

INSERT INTO `order_detail` (`Order_Detail_ID`, `Order_ID`, `Product_ID`, `Quantity`, `Price`) VALUES
(1, 1, 1, 2, 31500.00), -- 2 cuốn "Nàng Juliet ở trường nội trú - Tập 15" (giảm giá 10,000 từ voucher)
(2, 2, 4, 3, 36000.00); -- 3 cuốn "Blue Box - Tập 1"

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `Payment_ID` int(11) NOT NULL,
  `Payment_Name` varchar(255) NOT NULL,
  `Payment_Date` datetime DEFAULT current_timestamp(),
  `Payment_Method` enum('Credit Card','PayPal','Bank Transfer','Cash') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`Payment_ID`, `Payment_Name`, `Payment_Date`, `Payment_Method`) VALUES
(1, 'Thanh toán đơn hàng #1', '2025-03-25 12:00:00', 'Cash'),
(2, 'Thanh toán đơn hàng #2', '2025-03-25 12:30:00', 'Credit Card');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `Product_ID` int(11) NOT NULL,
  `Category_ID` int(11) DEFAULT NULL,
  `Publisher_ID` int(11) DEFAULT NULL,
  `Name` varchar(255) NOT NULL,
  `image` varchar(123) NOT NULL,
  `Description` text DEFAULT NULL,
  `Price` decimal(10,2) NOT NULL,
  `Stock` int(11) NOT NULL DEFAULT 0,
  `ISBN` varchar(20) DEFAULT NULL,
  `Page_Count` int(11) DEFAULT NULL,
  `Cover_Format` varchar(50) DEFAULT NULL,
  `Language` varchar(50) DEFAULT NULL,
  `Publication_Date` date DEFAULT NULL,
  `Author` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`Product_ID`, `Category_ID`, `Publisher_ID`, `Name`, `image`, `Description`, `Price`, `Stock`, `ISBN`, `Page_Count`, `Cover_Format`, `Language`, `Publication_Date`, `Author`) VALUES
(1, 1, 1, 'Nàng Juliet ở trường nội trú - Tập 15', 'prd1.jpg', 'Tác giả: Yousuke Kaneda\nĐối tượng: Tuổi mới lớn (15 – 18)\nKhuôn Khổ: 11,3x17,6 cm\nSố trang: 192\nĐịnh dạng: bìa mềm\nTrọng lượng: 170 gram\nBộ sách: Nàng Juliet ở trường nội trú', 31500.00, 50, '978-604-2-26728-1', 192, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Yousuke Kaneda'),
(2, 1, 1, 'Nai tơ ngơ ngác Nokotan - Tập 1', 'prd2.jpg', 'Tác giả: Oshioshio\r\nĐối tượng: Tuổi mới lớn (15 – 18)\r\nKhuôn Khổ: 13x18 cm\r\nSố trang: 128\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 145 gram\r\nBộ sách: Nai tơ ngơ ngác Nokotan', 27000.00, 30, '978-604-2-23517-4', 128, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Oshioshio'),
(3, 1, 1, 'Vị thần lang thang - Tập 24', 'prd3.jpg', 'Tác giả: Adachitoka\r\nĐối tượng: Tuổi mới lớn (15 – 18)\r\nKhuôn Khổ: 11.3x17.6 cm\r\nSố trang: 194\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 120 gram\r\nBộ sách: Vị thần lang thang', 22500.00, 40, '978-604-2-24105-2', 194, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Adachitoka'),
(4, 1, 1, 'Blue Box - Tập 1', 'prd4.jpg', 'Tác giả: Kouji Miura\r\nĐối tượng: Tuổi mới lớn (15 – 18)\r\nKhuôn Khổ: 11.3x17.6 cm\r\nSố trang: 192\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 180 gram\r\nBộ sách: Blue Box', 36000.00, 60, '978-604-2-24551-7', 192, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Kouji Miura'),
(5, 1, 1, 'Blue Box - Tập 2', 'prd5.jpg', 'Tác giả: Kouji Miura\r\nĐối tượng: Tuổi mới lớn (15 – 18)\r\nKhuôn Khổ: 11.3x17.6 cm\r\nSố trang: 192\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 180 gram\r\nBộ sách: Blue Box', 36000.00, 55, '978-604-2-24552-4', 192, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Kouji Miura'),
(6, 1, 1, 'Nina ở thị trấn cao nguyên - Tập 1', 'prd6.jpg', 'Tác giả: Itokatsu\r\nĐối tượng: Thiếu niên (11 – 15)\r\nKhuôn Khổ: 13x18 cm\r\nSố trang: 176\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 195 gram\r\nBộ sách: Nina ở thị trấn cao nguyên', 34000.00, 25, '978-604-2-33537-9', 176, 'bìa mềm', 'Việt Nam', '2025-03-01', 'Itokatsu'),
(7, 1, 1, 'Nina ở thị trấn cao nguyên - Tập 10', 'prd7.jpg', 'Tác giả: Itokatsu\r\nĐối tượng: Thiếu niên (11 – 15)\r\nKhuôn Khổ: 13x18 cm\r\nSố trang: 176\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 195 gram\r\nBộ sách: Nina ở thị trấn cao nguyên', 34000.00, 20, '978-604-2-33923-0', 176, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Itokatsu'),
(8, 1, 2, 'Shangri-La Frontier - Thợ săn game rác khiêu chiến game thần thánh - Tập 3', 'prd8.jpg', 'Tác giả: Katarina, Ryosuke Fuji\r\nĐối tượng: Tuổi mới lớn (15 – 18)\r\nKhuôn Khổ: 13x18 cm\r\nSố trang: 196\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 205 gram\r\nBộ sách: Shangri-La Frontier', 36000.00, 35, '978-604-2-27648-1', 196, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Katarina, Ryosuke Fuji'),
(9, 1, 2, 'Spy X Family - Tập 1', 'prd9.jpg', 'Tác giả: Tatsuya Endo\r\nĐối tượng: Tuổi mới lớn (15 – 18)\r\nKhuôn Khổ: 11,3x17,6 cm\r\nSố trang: ~ 200\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 140 gram\r\nBộ sách: Spy x Family', 27000.00, 70, '978-604-2-24552-4', 200, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Tatsuya Endo'),
(10, 1, 2, 'Lời hứa Lọ Lem - Tập 12', 'prd10.jpg', 'Tác giả: Oreco Tachibana\r\nĐối tượng: Tuổi mới lớn (15 – 18)\r\nKhuôn Khổ: 13x18 cm\r\nSố trang: 200\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 215 gram\r\nBộ sách: Lời hứa Lọ Lem', 36000.00, 45, '978-604-2-24216-5', 200, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Oreco Tachibana'),
(11, 1, 2, 'Nguyệt hạ thần kiếm - Tập 3', 'prd11.jpg', 'Tác giả: Tatsuya Endo\r\nĐối tượng: Tuổi mới lớn (15 – 18)\r\nKhuôn Khổ: 11,3x17,6 cm\r\nSố trang: 194\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 170 gram\r\nBộ sách: Nguyệt hạ thần kiếm', 31500.00, 30, '978-604-2-23496-2', 194, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Tatsuya Endo'),
(12, 1, 2, 'Nàng Juliet ở trường nội trú - Tập 16', 'prd12.jpg', 'Tác giả: Yousuke Kaneda\r\nĐối tượng: Tuổi mới lớn (15 – 18)\r\nKhuôn Khổ: 11,3x17,6 cm\r\nSố trang: 192\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 170 gram\r\nBộ sách: Nàng Juliet ở trường nội trú', 31500.00, 50, '978-604-2-26729-8', 192, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Yousuke Kaneda'),
(13, 1, 2, 'Thiên thần diệt thế - Seraph of the end - Tập 29', 'prd13.jpg', 'Tác giả: Takaya Kagami, Yamato Yamamoto, Daisuke Furuya\r\nĐối tượng: Tuổi mới lớn (15 – 18)\r\nKhuôn Khổ: 11.3x17.6 cm\r\nSố trang: 182\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 150 gram\r\nBộ sách: Thiên thần diệt thế - Seraph of the end', 22500.00, 40, '978-604-2-24090-1', 182, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Takaya Kagami, Yamato Yamamoto, Daisuke Furuya'),
(14, 1, 1, 'Vương quốc trời xanh Ariadne - Tập 18', 'prd14.jpg', 'Tác giả: Norihiro Yagi\r\nĐối tượng: Tuổi trưởng thành (trên 18 tuổi)\r\nKhuôn Khổ: 11,3x17,6 cm\r\nSố trang: 184\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 125 gram\r\nBộ sách: Vương quốc trời xanh Ariadne', 31500.00, 25, '978-604-2-27030-4', 184, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Norihiro Yagi'),
(15, 1, 1, 'Card Captor Sakura - Thẻ bài pha lê - Tập 14', 'prd15.jpg', 'Tác giả: Clamp\r\nĐối tượng: Thiếu niên (11 – 15)\r\nKhuôn Khổ: 11.3x17.6 cm\r\nSố trang: 192\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 110 gram\r\nBộ sách: Card Captor Sakura - Thẻ bài pha lê', 27000.00, 60, '978-604-2-24109-0', 192, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Clamp'),
(16, 2, 2, 'Tiểu thuyết One Piece Film RED', 'prd16.jpg', 'Tác giả: Eiichiro Oda, Jun Esaka, Tsutomu Kroiwa\r\nĐối tượng: Tuổi mới lớn (15 – 18)\r\nKhuôn Khổ: 13x19 cm\r\nSố trang: 244\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 260 gram\r\nBộ sách: One Piece ngoại truyện', 58500.00, 20, '978-604-2-32782-4', 244, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Eiichiro Oda, Jun Esaka, Tsutomu Kroiwa'),
(17, 2, 2, 'Tiểu Thuyết Thanh Gươm Diệt Quỷ - Người Dẫn Lối Của Gió', 'prd17.jpg', 'Tác giả: Koyoharu Gotouge, Aya Yajima\r\nĐối tượng: Tuổi mới lớn (15 – 18) \r\nKhuôn Khổ: 13x19 cm\r\nSố trang: 208\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 215 gram\r\nBộ sách: Tiểu thuyết Thanh gươm diệt quỷ', 45000.00, 30, '978-604-2-35012-9', 208, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Koyoharu Gotouge, Aya Yajima'),
(18, 2, 2, 'Tiểu thuyết The movie chú thuật hồi chiến - Tập 0', 'prd18.jpg', 'Tác giả: Gege Akutami, Ballad Kitaguni, Hiroshi Seko\r\nĐối tượng: Tuổi mới lớn (15 – 18)\r\nKhuôn Khổ: 13x19 cm\r\nSố trang: 300\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 300 gram\r\nBộ sách: Chú thuật hồi chiến - Tiểu thuyết', 65000.00, 15, '978-604-2-38570-1', 300, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Gege Akutami, Ballad Kitaguni, Hiroshi Seko'),
(19, 2, 1, 'Thám tử lừng danh Conan - Tiểu thuyết - Ngôi sao 5 cánh 1 triệu đô', 'prd19.jpg', 'Tác giả: Gosho Aoyama, Shima Mizuki, Takahiro Okura\r\nĐối tượng: Thiếu niên (11 – 15)\r\nKhuôn Khổ: 13x19 cm\r\nSố trang: 216\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 230 gram\r\nBộ sách: Thám tử lừng danh Conan - tiểu thuyết', 49500.00, 25, '978-604-2-38207-6', 216, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Gosho Aoyama, Shima Mizuki, Takahiro Okura'),
(20, 2, 1, 'Tiểu thuyết Doraemon - Nobita và bản giao hưởng Địa Cầu', 'prd20.jpg', 'Tác giả: Fujiko F Fujio, Teruko Utsumi, Kazuaki Imai\r\nĐối tượng: Nhi đồng (6 – 11), Thiếu niên (11 – 15)\r\nKhuôn Khổ: 13x19 cm\r\nSố trang: 228\r\nĐịnh dạng: bìa mềm\r\nTrọng lượng: 225 gram\r\nBộ sách: Tiểu thuyết Doraemon', 54000.00, 35, '978-604-2-37788-1', 228, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Fujiko F Fujio, Teruko Utsumi, Kazuaki Imai');

-- --------------------------------------------------------

--
-- Table structure for table `publisher`
--

CREATE TABLE `publisher` (
  `Publisher_ID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Address` text DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `publisher`
--

INSERT INTO `publisher` (`Publisher_ID`, `Name`, `Address`, `Phone`, `Email`) VALUES
(1, 'NXB Kim Đồng', '55 Quang Trung, Hà Nội', '024-3822-1234', 'kimdong@nxb.com'),
(2, 'NXB Trẻ', '161 Lý Chính Thắng, TP.HCM', '028-3822-5678', 'tre@nxb.com');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `User_ID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Role` enum('Admin','Customer','Seller') NOT NULL DEFAULT 'Customer',
  `Date_Joined` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`User_ID`, `Name`, `Email`, `Password`, `Phone`, `Role`, `Date_Joined`) VALUES
(1, 'Nguyễn Văn A', 'nguyen.van.a@example.com', '$2b$10$zX8z6X8z6X8z6X8z6X8z6uX8z6X8z6X8z6X8z6X8z6X', '0123456789', 'Customer', '2025-03-25 09:00:00'),
(2, 'Trần Thị B', 'tran.thi.b@example.com', '$2b$10$yY9y6Y9y6Y9y6Y9y6Y9y6uY9y6Y9y6Y9y6Y9y6Y9y6Y', '0987654321', 'Customer', '2025-03-25 09:05:00'),
(3, 'Admin User', 'admin@example.com', '$2b$10$xX7x6X7x6X7x6X7x6X7x6uX7x6X7x6X7x6X7x6X7x6X', '0909123456', 'Admin', '2025-03-25 09:10:00');

-- --------------------------------------------------------

--
-- Table structure for table `user_address`
--

CREATE TABLE `user_address` (
  `Address_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Street` varchar(255) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `State` varchar(100) DEFAULT NULL,
  `Country` varchar(100) DEFAULT NULL,
  `Postal_Code` varchar(20) DEFAULT NULL,
  `Is_Default` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user_address`
--

INSERT INTO `user_address` (`Address_ID`, `User_ID`, `Street`, `City`, `State`, `Country`, `Postal_Code`, `Is_Default`) VALUES
(1, 1, '123 Đường ABC', 'TP. Hồ Chí Minh', 'Quận XYZ', 'Việt Nam', '700000', 1),
(2, 2, '456 Đường DEF', 'Hà Nội', 'Quận UVW', 'Việt Nam', '100000', 1);

-- --------------------------------------------------------

--
-- Table structure for table `voucher`
--

CREATE TABLE `voucher` (
  `Voucher_ID` int(11) NOT NULL,
  `Voucher_Code` varchar(50) NOT NULL,
  `Discount_Amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `Expiration_Date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `voucher`
--

INSERT INTO `voucher` (`Voucher_ID`, `Voucher_Code`, `Discount_Amount`, `Expiration_Date`) VALUES
(1, 'DISCOUNT10', 10000.00, '2025-12-31'),
(2, 'FREESHIP', 20000.00, '2025-06-30');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `Wishlist_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Product_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `wishlist`
--

INSERT INTO `wishlist` (`Wishlist_ID`, `User_ID`, `Product_ID`) VALUES
(1, 1, 9), -- User 1 thích "Spy X Family - Tập 1"
(2, 1, 16), -- User 1 thích "Tiểu thuyết One Piece Film RED"
(3, 2, 4); -- User 2 thích "Blue Box - Tập 1"

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart_detail`
--
ALTER TABLE `cart_detail`
  ADD PRIMARY KEY (`Cart_Detail_ID`),
  ADD KEY `User_ID` (`User_ID`),
  ADD KEY `Product_ID` (`Product_ID`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`Category_ID`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`Comment_ID`),
  ADD KEY `User_ID` (`User_ID`),
  ADD KEY `Product_ID` (`Product_ID`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`Order_ID`),
  ADD KEY `User_ID` (`User_ID`),
  ADD KEY `Voucher_ID` (`Voucher_ID`),
  ADD KEY `Payment_ID` (`Payment_ID`);

--
-- Indexes for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD PRIMARY KEY (`Order_Detail_ID`),
  ADD KEY `Order_ID` (`Order_ID`),
  ADD KEY `Product_ID` (`Product_ID`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`Payment_ID`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`Product_ID`),
  ADD KEY `Category_ID` (`Category_ID`),
  ADD KEY `Publisher_ID` (`Publisher_ID`);

--
-- Indexes for table `publisher`
--
ALTER TABLE `publisher`
  ADD PRIMARY KEY (`Publisher_ID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`User_ID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `user_address`
--
ALTER TABLE `user_address`
  ADD PRIMARY KEY (`Address_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Indexes for table `voucher`
--
ALTER TABLE `voucher`
  ADD PRIMARY KEY (`Voucher_ID`),
  ADD UNIQUE KEY `Voucher_Code` (`Voucher_Code`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`Wishlist_ID`),
  ADD KEY `User_ID` (`User_ID`),
  ADD KEY `Product_ID` (`Product_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart_detail`
--
ALTER TABLE `cart_detail`
  MODIFY `Cart_Detail_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `Category_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `Comment_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `Order_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_detail`
--
ALTER TABLE `order_detail`
  MODIFY `Order_Detail_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `Payment_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `Product_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `publisher`
--
ALTER TABLE `publisher`
  MODIFY `Publisher_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `User_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_address`
--
ALTER TABLE `user_address`
  MODIFY `Address_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `voucher`
--
ALTER TABLE `voucher`
  MODIFY `Voucher_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `Wishlist_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart_detail`
--
ALTER TABLE `cart_detail`
  ADD CONSTRAINT `cart_detail_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_detail_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `product` (`Product_ID`) ON DELETE CASCADE;

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `product` (`Product_ID`) ON DELETE CASCADE;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`Voucher_ID`) REFERENCES `voucher` (`Voucher_ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `order_ibfk_3` FOREIGN KEY (`Payment_ID`) REFERENCES `payment` (`Payment_ID`) ON DELETE CASCADE;

--
-- Constraints for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD CONSTRAINT `order_detail_ibfk_1` FOREIGN KEY (`Order_ID`) REFERENCES `order` (`Order_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_detail_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `product` (`Product_ID`) ON DELETE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`Category_ID`) REFERENCES `category` (`Category_ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`Publisher_ID`) REFERENCES `publisher` (`Publisher_ID`) ON DELETE SET NULL;

--
-- Constraints for table `user_address`
--
ALTER TABLE `user_address`
  ADD CONSTRAINT `user_address_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `product` (`Product_ID`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;