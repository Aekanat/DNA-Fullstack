from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from utils.database import SessionLocal
from db.DiseaseRecord import DiseaseRecord
from typing import List, Optional

# for creating and closing DB session
def get_db():
    """
    Create and yield a SQLAlchemy database session, ensuring it is closed after use.

    Yields:
        Session: A SQLAlchemy database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Mapping for readable labels
COLUMN_MAPPING = {
    "GENEINFO": "Gene Info",
    "CHROM": "Chromosome",
    "POS": "Position",
    "ALT_TYPE": "Type",
    "REF": "Reference",
    "ALT_VALUE": "Value",
    "CLNSIG": "Clinical Significance",
    "CLNDN": "Disease",
    "Category": "Category"
}

LABEL_TO_DB_COLUMN = {v: k for k, v in COLUMN_MAPPING.items()}

def serialize_record(record: DiseaseRecord) -> dict:
    """
    Serialize a DiseaseRecord  instance into a dictionary.

    Args:
        record (DiseaseRecord): The record to serialize.

    Returns:
        dict: A dictionary representation of the record.
    """
    return {
        "ID":               record.ID,
        "Chromosome":       record.CHROM,
        "Position":         record.POS,
        "Reference":        record.REF,
        "Alternate":        record.ALT,
        "Clinical Significance": record.CLNSIG,
        "Gene Info":        record.GENEINFO,
        "Variant Class":    record.CLNVC,
        "Sequence Ontology":record.CLNVCSO,
        "Disease":          record.CLNDN,
        "Type":             record.ALT_TYPE,
        "Value":            record.ALT_VALUE,
        "Normal Sequence":  record.NormalSeq,
        "Mutated Sequence": record.MUTATED_SEQ,
        "Category":         record.Category,
        "Origin":           record.ORIGIN,
    }


def validate_db(db: Session) -> None:
    """
    Ensure that a database session is provided.

    Args:
        db (Session): The database session to validate.

    Raises:
        HTTPException: If db is None.
    """
    if db is None:
        raise HTTPException(status_code=500, detail="Database session is required")


def apply_filters(
    query,
    geneinfo: Optional[str],
    position_start: Optional[int],
    position_stop: Optional[int],
    chrom: Optional[List[str]],
    alt_type: Optional[List[str]],
    ref: Optional[List[str]],
    alt_value: Optional[List[str]],
    clnsig: Optional[List[str]],
    clndn: Optional[List[str]],
    category: Optional[List[str]],
    *,
    between_positions: bool = False
):
    """
    Apply various filters to a SQLAlchemy query based on provided parameters.

    Args:
        query: SQLAlchemy Query object to filter.
        geneinfo (str, optional): Substring to match in GENEINFO.
        position_start (int, optional): Minimum position value.
        position_stop (int, optional): Maximum position value.
        chrom (List[str], optional): List of chromosomes to include.
        alt_type (List[str], optional): List of alternate types.
        ref (List[str], optional): List of reference alleles.
        alt_value (List[str], optional): List of alternate values.
        clnsig (List[str], optional): List of clinical significance values.
        clndn (List[str], optional): List of disease names.
        category (List[str], optional): List of categories.
        between_positions (bool): If True, use between() filter for positions.

    Returns:
        The filtered SQLAlchemy Query object.
    """
    if geneinfo:
        query = query.filter(DiseaseRecord.GENEINFO.ilike(f"%{geneinfo}%"))
    
    if between_positions:
        if position_start is not None and position_stop is not None:
            query = query.filter(DiseaseRecord.POS.between(position_start, position_stop))
    else:
        if position_start is not None:
            query = query.filter(DiseaseRecord.POS >= position_start)
        if position_stop is not None:
            query = query.filter(DiseaseRecord.POS <= position_stop)
            
    if chrom:
        query = query.filter(DiseaseRecord.CHROM.in_(chrom))
    if alt_type:
        query = query.filter(DiseaseRecord.ALT_TYPE.in_(alt_type))
    if ref:
        query = query.filter(DiseaseRecord.REF.in_(ref))
    if alt_value:
        query = query.filter(DiseaseRecord.ALT_VALUE.in_(alt_value))
    if clnsig:
        query = query.filter(DiseaseRecord.CLNSIG.in_(clnsig))
    if clndn:
        query = query.filter(DiseaseRecord.CLNDN.in_(clndn))
    if category:
        query = query.filter(DiseaseRecord.Category.in_(category))
    
    return query


def filter_data_advanced(
    geneinfo: Optional[str],
    position_start: Optional[int],
    position_stop: Optional[int],
    chrom: Optional[List[str]],
    alt_type: Optional[List[str]],
    ref: Optional[List[str]],
    alt_value: Optional[List[str]],
    clnsig: Optional[List[str]],
    clndn: Optional[List[str]],
    category: Optional[List[str]],
    page: int = 1,
    limit: int = 100,
    db: Session = None
) -> dict:
    """
    Retrieve paginated and filtered disease records using between() on positions.

    Args:
        geneinfo (str, optional): Substring to match in gene information.
        position_start (int, optional): Start of position range.
        position_stop (int, optional): End of position range.
        chrom (List[str], optional): Chromosome list.
        alt_type (List[str], optional): Alternate type list.
        ref (List[str], optional): Reference allele list.
        alt_value (List[str], optional): Alternate value list.
        clnsig (List[str], optional): Clinical significance list.
        clndn (List[str], optional): Disease name list.
        category (List[str], optional): Category list.
        page (int): Page number for pagination.
        limit (int): Number of records per page.
        db (Session): Database session.

    Returns:
        dict: A dictionary containing pagination info and serialized data.

    Raises:
        HTTPException: If db session is not provided.
    """
    validate_db(db)
    query = db.query(DiseaseRecord)
    query = apply_filters(
        query,
        geneinfo, position_start, position_stop,
        chrom, alt_type, ref, alt_value,
        clnsig, clndn, category,
        between_positions=True
    )
    
    total_records = query.count()
    records = query.offset((page - 1) * limit).limit(limit).all()
    data = [serialize_record(record) for record in records]
    total_pages = (total_records + limit - 1) // limit
    
    return {
        "page": page,
        "limit": limit,
        "total_records": total_records,
        "total_pages": total_pages,
        "data": data,
    }


def filter_data_by_column(
    column: str,
    value: str,
    page: int = 1,
    limit: int = 100,
    db: Session = None
) -> dict:
    """
    Retrieve paginated disease records filtered by a single column.

    Args:
        column (str): Column name to filter by (key from COLUMN_MAPPING).
        value (str): Value to filter the column on.
        page (int): Page number for pagination.
        limit (int): Number of records per page.
        db (Session): Database session.

    Returns:
        dict: A dictionary containing pagination info and serialized data.

    Raises:
        HTTPException: If db session is None or column is invalid or a database error occurs.
    """
    validate_db(db)

    if column not in LABEL_TO_DB_COLUMN:
        raise HTTPException(status_code=400, detail=f"Column '{column}' does not exist.")

    db_column = LABEL_TO_DB_COLUMN[column]
    
    try:
        filters = {db_column: value}
        total_records = db.query(DiseaseRecord).filter_by(**filters).count()
        records = (
            db.query(DiseaseRecord)
            .filter_by(**filters)
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error occurred")
    
    data = [serialize_record(record) for record in records]
    total_pages = (total_records + limit - 1) // limit

    return {
        "page": page,
        "limit": limit,
        "total_records": total_records,
        "total_pages": total_pages,
        "data": data,
    }

def sort_chromosomes(chromosomes: list) -> list:
    allowed = [str(i) for i in range(1, 23)] + ['X']
    filtered = [c for c in chromosomes if c in allowed]
    def chrom_key(chrom):
        if chrom.isdigit():
            return int(chrom)
        elif chrom == 'X':
            return 23

    return sorted(filtered, key=chrom_key)


def get_unique_values(column: str, db: Session = None) -> List:
    """
    Get unique non-null values for a given column from DiseaseRecord.

    Args:
        column (str): Column name to retrieve unique values from (key from COLUMN_MAPPING).
        db (Session): Database session.

    Returns:
        List: A list of unique values.

    Raises:
        HTTPException: If db session is None, column is invalid, or a database error occurs.
    """
    validate_db(db)
    allowed_columns = list(COLUMN_MAPPING.keys())
    if column not in allowed_columns:
        raise HTTPException(status_code=400, detail=f"Column '{column}' does not exist.")
    try:
        column_attr = getattr(DiseaseRecord, column)
        results = db.query(column_attr).distinct().all()
        unique_values = [result[0] for result in results if result[0] is not None]
        if column == 'CHROM':
            unique_values = sort_chromosomes(unique_values)
        return unique_values
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error occurred: {str(e)}")


def get_all_records(page: int = 1, limit: int = 100, db: Session = None) -> dict:
    """
    Retrieve all disease records paginated without filtering.

    Args:
        page (int): Page number for pagination.
        limit (int): Number of records per page.
        db (Session): Database session.

    Returns:
        dict: A dictionary containing pagination info and serialized data.

    Raises:
        HTTPException: If db session is None or a database error occurs.
    """
    validate_db(db)
    try:
        offset = (page - 1) * limit
        total_records = db.query(func.count(DiseaseRecord.ID)).scalar()
        records = db.query(DiseaseRecord).offset(offset).limit(limit).all()
        data = [serialize_record(record) for record in records]
        return {
            "page": page,
            "limit": limit,
            "total_records": total_records,
            "total_pages": (total_records + limit - 1) // limit,
            "data": data,
        }
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error occurred: {str(e)}")

def get_disease_counts_grouped_by_category(db: Session = None) -> dict:
    """
    Get counts of disease records grouped by category and disease name.

    Args:
        db (Session): Database session.

    Returns:
        dict: A nested dictionary with category as keys and disease-count mappings as values.

    Raises:
        HTTPException: If db session is None or a database error occurs.
    """
    validate_db(db)
    try:
        results = (
            db.query(
                DiseaseRecord.Category,
                DiseaseRecord.CLNDN,
                func.count(DiseaseRecord.ID).label("count")
            )
            .group_by(DiseaseRecord.Category, DiseaseRecord.CLNDN)
            .all()
        )
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error occurred")

    output = {}
    for category, clndn, count in results:
        if category not in output:
            output[category] = {}
        output[category][clndn] = count

    return output


def get_columns() -> dict:
    """
    Retrieve the mapping of column keys to human-readable labels.

    Returns:
        dict: The COLUMN_MAPPING dictionary.

    Raises:
        HTTPException: If an unexpected error occurs.
    """
    try:
        return COLUMN_MAPPING
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving columns: {str(e)}")


def filter_query(
    geneinfo, position_start, position_stop,
    chrom, alt_type, ref, alt_value,
    clnsig, clndn, category,
    db: Session
):
    """
    Build a SQLAlchemy query with filters excluding between() for positions.

    Args:
        geneinfo (str, optional): Substring to match in gene information.
        position_start (int, optional): Minimum position value.
        position_stop (int, optional): Maximum position value.
        chrom (List[str], optional): Chromosome list.
        alt_type (List[str], optional): Alternate type list.
        ref (List[str], optional): Reference allele list.
        alt_value (List[str], optional): Alternate value list.
        clnsig (List[str], optional): Clinical significance list.
        clndn (List[str], optional): Disease name list.
        category (List[str], optional): Category list.
        db (Session): Database session.

    Returns:
        query: The constructed SQLAlchemy Query object.

    Raises:
        HTTPException: If db session is None.
    """
    validate_db(db)
    query = db.query(DiseaseRecord)
    query = apply_filters(
        query,
        geneinfo, position_start, position_stop,
        chrom, alt_type, ref, alt_value,
        clnsig, clndn, category,
        between_positions=False
    )
    return query
