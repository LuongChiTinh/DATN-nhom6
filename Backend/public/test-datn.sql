-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 28, 2025 lúc 06:33 PM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `cart_detail` (
  `Cart_Detail_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Product_ID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL CHECK (`Quantity` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `cart_detail` (`Cart_Detail_ID`, `User_ID`, `Product_ID`, `Quantity`) VALUES
(1, 1, 1, 2),
(2, 1, 9, 1),
(3, 2, 4, 3),
(4, 1, 18, 1),
(5, 1, 10, 1);

CREATE TABLE `category` (
  `Category_ID` int(11) NOT NULL,
  `Category_Name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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

CREATE TABLE `order` (
  `Order_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Voucher_ID` int(11) DEFAULT NULL,
  `Payment_ID` int(11) NOT NULL,
  `Order_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `Status` enum('Pending','Confirmed','Awaiting Shipment','Shipping','Delivered','Cancelled','Returned') DEFAULT 'Pending',
  `Total_amount` decimal(10,2) NOT NULL,
  `Recipient_Name` varchar(255) NOT NULL,
  `Recipient_Phone` varchar(20) NOT NULL,
  `Recipient_address` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `order` (`Order_ID`, `User_ID`, `Voucher_ID`, `Payment_ID`, `Order_date`, `Status`, `Total_amount`, `Recipient_Name`, `Recipient_Phone`, `Recipient_address`) VALUES
(1, 1, 1, 1, '2025-03-25 12:00:00', 'Delivered', 53000.00, 'Nguyễn Văn A', '0123456789', '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh'),
(2, 2, NULL, 2, '2025-03-25 12:30:00', 'Delivered', 108000.00, 'Trần Thị B', '0987654321', '456 Đường DEF, Quận UVW, Hà Nội'),
(3, 1, NULL, 3, '2025-03-26 09:00:00', 'Delivered', 72000.00, 'Nguyễn Văn A', '0123456789', '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh'),
(4, 6, 3, 4, '2025-03-27 15:00:00', 'Delivered', 130000.00, 'Lê Văn C', '0912345678', '789 Đường GHI, Quận JKL, Đà Nẵng');

CREATE TABLE `order_detail` (
  `Order_Detail_ID` int(11) NOT NULL,
  `Order_ID` int(11) NOT NULL,
  `Product_ID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL CHECK (`Quantity` > 0),
  `Price` decimal(10,2) NOT NULL CHECK (`Price` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `order_detail` (`Order_Detail_ID`, `Order_ID`, `Product_ID`, `Quantity`, `Price`) VALUES
(1, 1, 1, 2, 31500.00),
(2, 2, 4, 3, 36000.00),
(3, 3, 5, 2, 36000.00),
(4, 4, 25, 1, 150000.00);

CREATE TABLE `payment` (
  `Payment_ID` int(11) NOT NULL,
  `Payment_Name` varchar(255) NOT NULL,
  `Payment_Date` datetime DEFAULT CURRENT_TIMESTAMP,
  `Payment_Method` enum('Credit Card','PayPal','Bank Transfer','Cash') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `payment` (`Payment_ID`, `Payment_Name`, `Payment_Date`, `Payment_Method`) VALUES
(1, 'Thanh toán đơn hàng #1', '2025-03-25 12:00:00', 'Cash'),
(2, 'Thanh toán đơn hàng #2', '2025-03-25 12:30:00', 'Credit Card'),
(3, 'Thanh toán đơn hàng #3', '2025-03-26 09:00:00', 'Bank Transfer'),
(4, 'Thanh toán đơn hàng #4', '2025-03-27 15:00:00', 'PayPal');

CREATE TABLE `product` (
  `Product_ID` int(11) NOT NULL,
  `Category_ID` int(11) DEFAULT NULL,
  `Publisher_ID` int(11) DEFAULT NULL,
  `Name` varchar(255) NOT NULL,
  `image` varchar(123) NOT NULL,
  `Description` text DEFAULT NULL,
  `Price` decimal(10,2) NOT NULL,
  `Stock` int(11) NOT NULL DEFAULT 0,
  `Views` int(11) DEFAULT 0,
  `ISBN` varchar(20) DEFAULT NULL,
  `Page_Count` int(11) DEFAULT NULL,
  `Cover_Format` varchar(50) DEFAULT NULL,
  `Language` varchar(50) DEFAULT NULL,
  `Publication_Date` date DEFAULT NULL,
  `Author` varchar(255) DEFAULT NULL,
  `Purchase_Count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `product` (`Product_ID`, `Category_ID`, `Publisher_ID`, `Name`, `image`, `Description`, `Price`, `Stock`, `Views`, `ISBN`, `Page_Count`, `Cover_Format`, `Language`, `Publication_Date`, `Author`, `Purchase_Count`) VALUES
(1, 1, 1, 'Nàng Juliet ở trường nội trú - Tập 15', 'prd1.jpg', 'Tác giả: Yousuke Kaneda\nĐối tượng: Tuổi mới lớn (15 – 18)\nKhuôn Khổ: 11,3x17,6 cm\nSố trang: 192\nĐịnh dạng: bìa mềm\nTrọng lượng: 170 gram\nBộ sách: Nàng Juliet ở trường nội trú', 31500.00, 48, 120, '978-604-2-26728-1', 192, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Yousuke Kaneda', 2),
(2, 1, 1, 'Nina ở thị trấn cao nguyên - Tập 1', 'prd6.jpg', 'Tác giả: Itokatsu\nĐối tượng: Thiếu niên (11 – 15)\nKhuôn Khổ: 13x18 cm\nSố trang: 176\nĐịnh dạng: bìa mềm\nTrọng lượng: 195 gram\nBộ sách: Nina ở thị trấn cao nguyên', 34000.00, 25, 2, '978-604-2-33537-9', 176, 'bìa mềm', 'Việt Nam', '2025-03-01', 'Itokatsu', 0),
(3, 1, 2, 'Spy X Family - Tập 1', 'prd9.jpg', 'Tác giả: Tatsuya Endo\nĐối tượng: Tuổi mới lớn (15 – 18)\nKhuôn Khổ: 11,3x17,6 cm\nSố trang: ~ 200\nĐịnh dạng: bìa mềm\nTrọng lượng: 140 gram\nBộ sách: Spy x Family', 27000.00, 70, 152, '978-604-2-24552-4', 200, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Tatsuya Endo', 0),
(4, 2, 2, 'Tiểu thuyết The movie chú thuật hồi chiến - Tập 0', 'prd18.jpg', 'Tác giả: Gege Akutami, Ballad Kitaguni, Hiroshi Seko\nĐối tượng: Tuổi mới lớn (15 – 18)\nKhuôn Khổ: 13x19 cm\nSố trang: 300\nĐịnh dạng: bìa mềm\nTrọng lượng: 300 gram\nBộ sách: Chú thuật hồi chiến - Tiểu thuyết', 65000.00, 12, 0, '978-604-2-38570-1', 300, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Gege Akutami, Ballad Kitaguni, Hiroshi Seko', 3),
(5, 1, 1, 'Blue Box - Tập 1', 'prd4.jpg', 'Tác giả: Kouji Miura\nĐối tượng: Tuổi mới lớn (15 – 18)\nKhuôn Khổ: 11.3x17.6 cm\nSố trang: 192\nĐịnh dạng: bìa mềm\nTrọng lượng: 180 gram\nBộ sách: Blue Box', 36000.00, 58, 202, '978-604-2-24551-7', 192, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Kouji Miura', 2),
(6, 1, 2, 'Thiên thần diệt thế - Seraph of the end - Tập 29', 'prd13.jpg', 'Tác giả: Takaya Kagami, Yamato Yamamoto, Daisuke Furuya\nĐối tượng: Tuổi mới lớn (15 – 18)\nKhuôn Khổ: 11.3x17.6 cm\nSố trang: 182\nĐịnh dạng: bìa mềm\nTrọng lượng: 150 gram\nBộ sách: Thiên thần diệt thế - Seraph of the end', 22500.00, 40, 0, '978-604-2-24090-1', 182, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Takaya Kagami, Yamato Yamamoto, Daisuke Furuya', 0),
(7, 2, 1, 'Thám tử lừng danh Conan - Tiểu thuyết - Ngôi sao 5 cánh 1 triệu đô', 'prd19.jpg', 'Tác giả: Gosho Aoyama, Shima Mizuki, Takahiro Okura\nĐối tượng: Thiếu niên (11 – 15)\nKhuôn Khổ: 13x19 cm\nSố trang: 216\nĐịnh dạng: bìa mềm\nTrọng lượng: 230 gram\nBộ sách: Thám tử lừng danh Conan - tiểu thuyết', 49500.00, 25, 0, '978-604-2-38207-6', 216, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Gosho Aoyama, Shima Mizuki, Takahiro Okura', 0),
(8, 1, 1, 'Nai tơ ngơ ngác Nokotan - Tập 1', 'prd2.jpg', 'Tác giả: Oshioshio\nĐối tượng: Tuổi mới lớn (15 – 18)\nKhuôn Khổ: 13x18 cm\nSố trang: 128\nĐịnh dạng: bìa mềm\nTrọng lượng: 145 gram\nBộ sách: Nai tơ ngơ ngác Nokotan', 27000.00, 30, 12, '978-604-2-23517-4', 128, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Oshioshio', 0),
(9, 1, 1, 'Vương quốc trời xanh Ariadne - Tập 18', 'prd14.jpg', 'Tác giả: Norihiro Yagi\nĐối tượng: Tuổi trưởng thành (trên 18 tuổi)\nKhuôn Khổ: 11,3x17,6 cm\nSố trang: 184\nĐịnh dạng: bìa mềm\nTrọng lượng: 125 gram\nBộ sách: Vương quốc trời xanh Ariadne', 31500.00, 25, 0, '978-604-2-27030-4', 184, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Norihiro Yagi', 0),
(10, 2, 2, 'Tiểu Thuyết Thanh Gươm Diệt Quỷ - Người Dẫn Lối Của Gió', 'prd17.jpg', 'Tác giả: Koyoharu Gotouge, Aya Yajima\nĐối tượng: Tuổi mới lớn (15 – 18)\nKhuôn Khổ: 13x19 cm\nSố trang: 208\nĐịnh dạng: bìa mềm\nTrọng lượng: 215 gram\nBộ sách: Tiểu thuyết Thanh gươm diệt quỷ', 45000.00, 30, 0, '978-604-2-25012-9', 208, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Koyoharu Gotouge, Aya Yajima', 0),
(11, 1, 2, 'Lời hứa Lọ Lem - Tập 12', 'prd10.jpg', 'Tác giả: Oreco Tachibana\nĐối tượng: Tuổi mới lớn (15 – 18)\nKhuôn Khổ: 13x18 cm\nSố trang: 200\nĐịnh dạng: bìa mềm\nTrọng lượng: 215 gram\nBộ sách: Lời hứa Lọ Lem', 36000.00, 45, 1, '978-604-2-24216-5', 200, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Oreco Tachibana', 0),
(12, 1, 1, 'Vị thần lang thang - Tập 24', 'prd3.jpg', 'Tác giả: Adachitoka\nĐối tượng: Tuổi mới lớn (15 – 18)\nKhuôn Khổ: 11.3x17.6 cm\nSố trang: 194\nĐịnh dạng: bìa mềm\nTrọng lượng: 120 gram\nBộ sách: Vị thần lang thang', 22500.00, 40, 28, '978-604-2-24105-2', 194, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Adachitoka', 0),
(13, 1, 2, 'Nguyệt hạ thần kiếm - Tập 3', 'prd11.jpg', 'Tác giả: Tatsuya Endo\nĐối tượng: Tuổi mới lớn (15 – 18)\nKhuôn Khổ: 11,3x17,6 cm\nSố trang: 194\nĐịnh dạng: bìa mềm\nTrọng lượng: 170 gram\nBộ sách: Nguyệt hạ thần kiếm', 31500.00, 30, 0, '978-604-2-23496-2', 194, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Tatsuya Endo', 0),
(14, 2, 2, 'Tiểu thuyết One Piece Film RED', 'prd16.jpg', 'Tác giả: Eiichiro Oda, Jun Esaka, Tsutomu Kroiwa\nĐối tượng: Tuổi mới lớn (15 – 18)\nKhuôn Khổ: 13x19 cm\nSố trang: 244\nĐịnh dạng: bìa mềm\nTrọng lượng: 260 gram\nBộ sách: One Piece ngoại truyện', 58500.00, 20, 0, '978-604-2-32782-4', 244, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Eiichiro Oda, Jun Esaka, Tsutomu Kroiwa', 0),
(15, 1, 1, 'Blue Box - Tập 2', 'prd5.jpg', 'Tác giả: Kouji Miura\nĐối tượng: Tuổi mới lớn (15 – 18)\nKhuôn Khổ: 11.3x17.6 cm\nSố trang: 192\nĐịnh dạng: bìa mềm\nTrọng lượng: 180 gram\nBộ sách: Blue Box', 36000.00, 55, 3, '978-604-2-24552-4', 192, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Kouji Miura', 0),
(16, 1, 1, 'Card Captor Sakura - Thẻ bài pha lê - Tập 14', 'prd15.jpg', 'Tác giả: Clamp\nĐối tượng: Thiếu niên (11 – 15)\nKhuôn Khổ: 11.3x17.6 cm\nSố trang: 192\nĐịnh dạng: bìa mềm\nTrọng lượng: 110 gram\nBộ sách: Card Captor Sakura - Thẻ bài pha lê', 27000.00, 60, 0, '978-604-2-24109-0', 192, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Clamp', 0),
(17, 1, 2, 'Nàng Juliet ở trường nội trú - Tập 16', 'prd12.jpg', 'Tác giả: Yousuke Kaneda\nĐối tượng: Tuổi mới lớn (15 – 18)\nKhuôn Khổ: 11,3x17,6 cm\nSố trang: 192\nĐịnh dạng: bìa mềm\nTrọng lượng: 170 gram\nBộ sách: Nàng Juliet ở trường nội trú', 31500.00, 50, 0, '978-604-2-26729-8', 192, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Yousuke Kaneda', 0),
(18, 1, 2, 'Shangri-La Frontier - Thợ săn game rác khiêu chiến game thần thánh - Tập 3', 'prd8.jpg', 'Tác giả: Katarina, Ryosuke Fuji\nĐối tượng: Tuổi mới lớn (15 – 18)\nKhuôn Khổ: 13x18 cm\nSố trang: 196\nĐịnh dạng: bìa mềm\nTrọng lượng: 205 gram\nBộ sách: Shangri-La Frontier', 36000.00, 35, 3, '978-604-2-27648-1', 196, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Katarina, Ryosuke Fuji', 0),
(19, 1, 1, 'Nina ở thị trấn cao nguyên - Tập 10', 'prd7.jpg', 'Tác giả: Itokatsu\nĐối tượng: Thiếu niên (11 – 15)\nKhuôn Khổ: 13x18 cm\nSố trang: 176\nĐịnh dạng: bìa mềm\nTrọng lượng: 195 gram\nBộ sách: Nina ở thị trấn cao nguyên', 34000.00, 20, 2, '978-604-2-33923-0', 176, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Itokatsu', 0),
(20, 2, 1, 'Tiểu thuyết Doraemon - Nobita và bản giao hưởng Địa Cầu', 'prd20.jpg', 'Tác giả: Fujiko F Fujio, Teruko Utsumi, Kazuaki Imai\nĐối tượng: Nhi đồng (6 – 11), Thiếu niên (11 – 15)\nKhuôn Khổ: 13x19 cm\nSố trang: 228\nĐịnh dạng: bìa mềm\nTrọng lượng: 225 gram\nBộ sách: Tiểu thuyết Doraemon', 54000.00, 35, 1, '978-604-2-37788-1', 228, 'bìa mềm', 'Việt Nam', '2025-03-15', 'Fujiko F Fujio, Teruko Utsumi, Kazuaki Imai', 0),
(21, 3, 3, 'Người Đua Diều', 'prd21.jpg', 'Tác giả: Khaled Hosseini\nĐối tượng: Người lớn\nKhuôn Khổ: 14x20.5 cm\nSố trang: 400\nĐịnh dạng: bìa mềm', 120000.00, 30, 50, '978-604-1-12345-6', 400, 'bìa mềm', 'Việt Nam', '2025-03-20', 'Khaled Hosseini', 0),
(22, 5, 1, 'Doraemon - Tập 45', 'prd22.jpg', 'Tác giả: Fujiko F Fujio\nĐối tượng: Nhi đồng (6 – 11)\nKhuôn Khổ: 11.3x17.6 cm\nSố trang: 192', 25000.00, 100, 80, '978-604-2-12346-3', 192, 'bìa mềm', 'Việt Nam', '2025-03-25', 'Fujiko F Fujio', 0),
(23, 6, 3, 'Đắc Nhân Tâm', 'prd23.jpg', 'Tác giả: Dale Carnegie\nĐối tượng: Người lớn\nKhuôn Khổ: 13x19 cm\nSố trang: 320', 85000.00, 40, 201, '978-604-1-12347-0', 320, 'bìa mềm', 'Việt Nam', '2025-03-25', 'Dale Carnegie', 0),
(24, 9, 2, 'Tâm Lý Học Hành Vi', 'prd24.jpg', 'Tác giả: Nguyễn Văn B\nĐối tượng: Người lớn\nKhuôn Khổ: 14x20.5 cm\nSố trang: 280', 95000.00, 25, 30, '978-604-2-12348-7', 280, 'bìa mềm', 'Việt Nam', '2025-03-25', 'Nguyễn Văn B', 0),
(25, 10, 3, 'Trăm Năm Cô Đơn', 'prd25.jpg', 'Tác giả: Gabriel García Márquez\nĐối tượng: Người lớn\nKhuôn Khổ: 14x20.5 cm\nSố trang: 450', 150000.00, 19, 100, '978-604-1-12349-4', 450, 'bìa mềm', 'Việt Nam', '2025-03-25', 'Gabriel García Márquez', 1);

CREATE TABLE `publisher` (
  `Publisher_ID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Address` text DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `publisher` (`Publisher_ID`, `Name`, `Address`, `Phone`, `Email`) VALUES
(1, 'NXB Kim Đồng', '55 Quang Trung, Hà Nội', '024-3822-1234', 'kimdong@nxb.com'),
(2, 'NXB Trẻ', '161 Lý Chính Thắng, TP.HCM', '028-3822-5678', 'tre@nxb.com'),
(3, 'NXB Văn Học', '123 Trần Hưng Đạo, TP.HCM', '028-3822-9012', 'vanhoc@nxb.com');

CREATE TABLE `review` (
  `Review_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Product_ID` int(11) NOT NULL,
  `Stars` int(11) NOT NULL CHECK (`Stars` BETWEEN 1 AND 5),
  `Content` text DEFAULT NULL,
  `Review_Date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `review` (`Review_ID`, `User_ID`, `Product_ID`, `Stars`, `Content`, `Review_Date`) VALUES
(1, 1, 1, 5, 'Sách rất hay, đáng đọc!', '2025-03-25 10:30:00'),
(2, 2, 4, 4, 'Cốt truyện thú vị, nhưng giấy hơi mỏng.', '2025-03-25 11:00:00'),
(3, 1, 5, 4, 'Hình ảnh đẹp, nội dung ổn.', '2025-03-26 12:00:00'),
(4, 6, 25, 5, 'Tuyệt vời, không thể bỏ lỡ!', '2025-03-27 16:30:00');

CREATE TABLE `user` (
  `User_ID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Role` enum('Admin','Customer','Seller') NOT NULL DEFAULT 'Customer',
  `Date_Joined` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `user` (`User_ID`, `Name`, `Email`, `Password`, `Phone`, `Role`, `Date_Joined`) VALUES
(1, 'Nguyễn Văn A', 'nguyen.van.a@example.com', '$2b$10$zX8z6X8z6X8z6X8z6X8z6uX8z6X8z6X8z6X8z6X8z6X', '0123456789', 'Customer', '2025-03-25 09:00:00'),
(2, 'Trần Thị B', 'tran.thi.b@example.com', '$2b$10$yY9y6Y9y6Y9y6Y9y6Y9y6uY9y6Y9y6Y9y6Y9y6Y9y6Y', '0987654321', 'Customer', '2025-03-25 09:05:00'),
(6, 'Lê Văn C', 'le.van.c@example.com', '$2b$10$aA1a6A1a6A1a6A1a6A1a6uA1a6A1a6A1a6A1a6A1a6A', '0912345678', 'Customer', '2025-03-27 10:00:00');

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

INSERT INTO `user_address` (`Address_ID`, `User_ID`, `Street`, `City`, `State`, `Country`, `Postal_Code`, `Is_Default`) VALUES
(1, 1, '123 Đường ABC', 'TP. Hồ Chí Minh', 'Quận XYZ', 'Việt Nam', '700000', 1),
(2, 2, '456 Đường DEF', 'Hà Nội', 'Quận UVW', 'Việt Nam', '100000', 1),
(3, 6, '789 Đường GHI', 'Đà Nẵng', 'Quận JKL', 'Việt Nam', '550000', 1);

CREATE TABLE `voucher` (
  `Voucher_ID` int(11) NOT NULL,
  `Voucher_Code` varchar(50) NOT NULL,
  `Discount_Amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `Expiration_Date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `voucher` (`Voucher_ID`, `Voucher_Code`, `Discount_Amount`, `Expiration_Date`) VALUES
(1, 'DISCOUNT10', 10000.00, '2025-12-31'),
(2, 'FREESHIP', 20000.00, '2025-06-30'),
(3, 'WELCOME20', 20000.00, '2025-09-30');

CREATE TABLE `wishlist` (
  `Wishlist_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Product_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `wishlist` (`Wishlist_ID`, `User_ID`, `Product_ID`) VALUES
(1, 1, 4),
(2, 2, 5),
(3, 6, 25);

ALTER TABLE `cart_detail`
  ADD PRIMARY KEY (`Cart_Detail_ID`),
  ADD KEY `User_ID` (`User_ID`),
  ADD KEY `Product_ID` (`Product_ID`);

ALTER TABLE `category`
  ADD PRIMARY KEY (`Category_ID`);

ALTER TABLE `order`
  ADD PRIMARY KEY (`Order_ID`),
  ADD KEY `User_ID` (`User_ID`),
  ADD KEY `Voucher_ID` (`Voucher_ID`),
  ADD KEY `Payment_ID` (`Payment_ID`);

ALTER TABLE `order_detail`
  ADD PRIMARY KEY (`Order_Detail_ID`),
  ADD KEY `Order_ID` (`Order_ID`),
  ADD KEY `Product_ID` (`Product_ID`);

ALTER TABLE `payment`
  ADD PRIMARY KEY (`Payment_ID`);

ALTER TABLE `product`
  ADD PRIMARY KEY (`Product_ID`),
  ADD KEY `Category_ID` (`Category_ID`),
  ADD KEY `Publisher_ID` (`Publisher_ID`);

ALTER TABLE `publisher`
  ADD PRIMARY KEY (`Publisher_ID`);

ALTER TABLE `review`
  ADD PRIMARY KEY (`Review_ID`),
  ADD UNIQUE KEY `unique_user_product` (`User_ID`, `Product_ID`),
  ADD KEY `Product_ID` (`Product_ID`);

ALTER TABLE `user`
  ADD PRIMARY KEY (`User_ID`),
  ADD UNIQUE KEY `Email` (`Email`);

ALTER TABLE `user_address`
  ADD PRIMARY KEY (`Address_ID`),
  ADD KEY `User_ID` (`User_ID`);

ALTER TABLE `voucher`
  ADD PRIMARY KEY (`Voucher_ID`),
  ADD UNIQUE KEY `Voucher_Code` (`Voucher_Code`);

ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`Wishlist_ID`),
  ADD KEY `User_ID` (`User_ID`),
  ADD KEY `Product_ID` (`Product_ID`);

ALTER TABLE `cart_detail`
  MODIFY `Cart_Detail_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `category`
  MODIFY `Category_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

ALTER TABLE `order`
  MODIFY `Order_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `order_detail`
  MODIFY `Order_Detail_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `payment`
  MODIFY `Payment_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `product`
  MODIFY `Product_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

ALTER TABLE `publisher`
  MODIFY `Publisher_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `review`
  MODIFY `Review_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `user`
  MODIFY `User_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `user_address`
  MODIFY `Address_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `voucher`
  MODIFY `Voucher_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `wishlist`
  MODIFY `Wishlist_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `cart_detail`
  ADD CONSTRAINT `cart_detail_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_detail_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `product` (`Product_ID`) ON DELETE CASCADE;

ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`Voucher_ID`) REFERENCES `voucher` (`Voucher_ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `order_ibfk_3` FOREIGN KEY (`Payment_ID`) REFERENCES `payment` (`Payment_ID`) ON DELETE CASCADE;

ALTER TABLE `order_detail`
  ADD CONSTRAINT `order_detail_ibfk_1` FOREIGN KEY (`Order_ID`) REFERENCES `order` (`Order_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_detail_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `product` (`Product_ID`) ON DELETE CASCADE;

ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`Category_ID`) REFERENCES `category` (`Category_ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`Publisher_ID`) REFERENCES `publisher` (`Publisher_ID`) ON DELETE SET NULL;

ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `product` (`Product_ID`) ON DELETE CASCADE;

ALTER TABLE `user_address`
  ADD CONSTRAINT `user_address_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE;

ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `product` (`Product_ID`) ON DELETE CASCADE;

COMMIT;