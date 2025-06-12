from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List, Optional

from utils.dbHandler import (
    filter_data_advanced,
    filter_data_by_column,
    filter_query,
    get_disease_counts_grouped_by_category,
    get_db,
)
from db.DiseaseRecord import DiseaseRecord

router = APIRouter()


class VariantFilterParams:
    """
    Dependency class to collect common variant filter query parameters.

    Genomic location filters:
        - geneinfo (str | None): Gene symbol.
        - chrom (List[str] | None): Chromosome.
        - position_start (int | None): Start genomic position.
        - position_stop (int | None): Stop genomic position.

    Allele-related filters:
        - ref (List[str] | None): Reference alleles.
        - alt_value (List[str] | None): Alternate allele values.
        - alt_type (List[str] | None): Alternate allele types.

    Clinical significance filters:
        - clnsig (List[str] | None): Clinical significance values.
        - clndn (List[str] | None): Clinical disease names.
        - category (List[str] | None): Custom variant categories.
    """
    def __init__(
        self,
        geneinfo: Optional[str] = Query(None, description="Free-text search for gene info"),
        position_start: Optional[int] = Query(None, description="Start position for range search"),
        position_stop: Optional[int] = Query(None, description="Stop position for range search"),
        chrom: Optional[List[str]] = Query(None, description="List of chromosome values"),
        alt_type: Optional[List[str]] = Query(None, description="List of alternate type values"),
        ref: Optional[List[str]] = Query(None, description="List of reference allele values"),
        alt_value: Optional[List[str]] = Query(None, description="List of alternate allele values"),
        clnsig: Optional[List[str]] = Query(None, description="List of clinical significance values"),
        clndn: Optional[List[str]] = Query(None, description="List of disease name values"),
        category: Optional[List[str]] = Query(None, description="List of classification categories"),
    ):
        self.geneinfo = geneinfo
        self.position_start = position_start
        self.position_stop = position_stop
        self.chrom = chrom
        self.alt_type = alt_type
        self.ref = ref
        self.alt_value = alt_value
        self.clnsig = clnsig
        self.clndn = clndn
        self.category = category


def sort_chromosomes(data: List[dict]) -> List[dict]:
    """
    Sort chromosomes: numeric first ascending, then non-numeric.

    :param data: List of dicts each containing 'chromosome' and 'count'.
    :return: Sorted list by chromosome.
    """
    def key_fn(item: dict):
        ch = item.get("chromosome", "")
        return int(ch) if ch.isdigit() else float('inf')

    return sorted(data, key=key_fn)


@router.get("/columns")
def get_columns_route(db: Session = Depends(get_db)) -> dict:
    """
    Get mapping of internal column keys to readable labels.

    :param db: Database session dependency.
    :return: {'columns': mapping of column keys to labels}.
    """
    try:
        from utils.dbHandler import get_columns
        columns = get_columns()
        return {"columns": columns}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get Columns Unique Values
@router.get("/unique-values")
def get_unique_values_route(
    column: str = Query(..., description="Column name to fetch unique values"),
    db: Session = Depends(get_db),
) -> dict:
    """
    Get unique non-null values for a specific column.

    :param column: Column name to query.
    :param db: Database session.
    :return: {'values': [unique values]}
    """
    try:
        from utils.dbHandler import get_unique_values
        values = get_unique_values(column, db=db)
        return {"values": values}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get all data
@router.get("/all")
def get_all_data(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, description="Records per page"),
    db: Session = Depends(get_db),
) -> dict:
    """
    Retrieve all disease records with pagination.

    :param page: Page number (1-based).
    :param limit: Records per page.
    :param db: Database session.
    :return: {'data': paginated records}
    """
    try:
        result = filter_data_by_column(None, None, page, limit, db=db)
        return {"data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get Filtered Data (all Field)
@router.get("/advanced-search")
def advanced_search(
    filters: VariantFilterParams = Depends(),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, description="Records per page"),
    db: Session = Depends(get_db),
) -> dict:
    """
    Perform advanced search with optional filters and pagination.

    :param filters: VariantFilterParams for filtering.
    :param page: Page number (1-based).
    :param limit: Records per page.
    :param db: Database session.
    :return: {'data': search results}
    """
    try:
        result = filter_data_advanced(
            filters.geneinfo,
            filters.position_start,
            filters.position_stop,
            filters.chrom,
            filters.alt_type,
            filters.ref,
            filters.alt_value,
            filters.clnsig,
            filters.clndn,
            filters.category,
            page,
            limit,
            db=db,
        )
        return {"data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get Filtered Data (One Field)
@router.get("/filter")
def filter_data(
    column: str = Query(..., description="Column name to filter"),
    value: str = Query(..., description="Value to filter for"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, description="Records per page"),
    db: Session = Depends(get_db),
) -> dict:
    """
    Filter data by specific column and value with pagination.

    :param column: Column to filter.
    :param value: Value to match.
    :param page: Page number (1-based).
    :param limit: Records per page.
    :param db: Database session.
    :return: {'data': filtered records}
    """
    try:
        result = filter_data_by_column(column, value, page, limit, db=db)
        return {"data": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/disease-counts")
def disease_counts(db: Session = Depends(get_db)) -> dict:
    """
    Counts of disease records by category and disease name.

    :param db: Database session.
    :return: {'data': grouped counts}
    """
    try:
        result = get_disease_counts_grouped_by_category(db=db)
        return {"data": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def _group_and_sort(
    group_field: str,
    filters: VariantFilterParams,
    db: Session,
    limit: Optional[int] = None,
    sort_fn=None,
) -> List[dict]:
    """
    Helper to group by a field, count, sort, and optionally limit results.

    :param group_field: Model attribute name to group by.
    :param filters: VariantFilterParams for query filtering.
    :param db: Database session.
    :param limit: Optional maximum number of results.
    :param sort_fn: Optional SQLAlchemy sort function.
    :return: List of dicts with lowercased group_field and count.
    """
    query = filter_query(
        filters.geneinfo,
        filters.position_start,
        filters.position_stop,
        filters.chrom,
        filters.alt_type,
        filters.ref,
        filters.alt_value,
        filters.clnsig,
        filters.clndn,
        filters.category,
        db,
    )
    entity = getattr(DiseaseRecord, group_field)
    q = query.with_entities(entity.label(group_field.lower()), func.count(DiseaseRecord.ID).label("count")).group_by(entity)
    
    if sort_fn is not None:
        q = q.order_by(sort_fn)
    if limit is not None:
        q = q.limit(limit)

    results = q.all()
    data = [{group_field.lower(): r[0], "count": r[1]} for r in results]
    return sort_chromosomes(data) if group_field == "CHROM" else data


@router.get("/variant-counts/chromosomes")
def variant_counts_chromosomes(
    filters: VariantFilterParams = Depends(),
    db: Session = Depends(get_db),
) -> dict:
    """
    Count variants by chromosome after applying filters.

    :param filters: VariantFilterParams for filtering.
    :param db: Database session.
    :return: {'data': sorted chromosome counts}
    """
    try:
        data = _group_and_sort("CHROM", filters, db)
        return {"data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/variant-counts/alt-type")
def variant_counts_alt_type(
    filters: VariantFilterParams = Depends(),
    db: Session = Depends(get_db),
) -> dict:
    """
    Count variants by alternate type after applying filters.

    :param filters: VariantFilterParams for filtering.
    :param db: Database session.
    :return: {'data': alternate type counts}
    """
    try:
        data = _group_and_sort("ALT_TYPE", filters, db)
        return {"data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/variant-counts/genes")
def variant_counts_gene(
    filters: VariantFilterParams = Depends(),
    db: Session = Depends(get_db),
) -> dict:
    """
    Top genes by variant count after applying filters.

    :param filters: VariantFilterParams for filtering.
    :param db: Database session.
    :return: {'data': top gene counts}
    """
    try:
        data = _group_and_sort(
            "GENEINFO",
            filters,
            db,
            limit=10,
            sort_fn=func.count(DiseaseRecord.ID).desc(),
        )
        return {"data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/variant-counts/clinical-significance")
def variant_counts_clnsig(
    filters: VariantFilterParams = Depends(),
    db: Session = Depends(get_db),
) -> dict:
    """
    Count variants by clinical significance after applying filters.

    :param filters: VariantFilterParams for filtering.
    :param db: Database session.
    :return: {'data': clinical significance counts}
    """
    try:
        data = _group_and_sort("CLNSIG", filters, db)
        return {"data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
